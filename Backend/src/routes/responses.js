const express = require('express');
const { body } = require('express-validator');
const prisma = require('../utils/prisma');
const { handleValidationErrors } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const { parsePdf, parseXlsx, extractDataWithGemini, checkGeminiStatus } = require('../utils/parser');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Map extracted data to Prisma schema format
const mapExtractedDataToPrisma = (extractedData, year) => {
  console.log('🔄 Mapping extracted data to Prisma schema...');
  
  const mapped = {
    year: parseInt(year),
    // Environmental metrics
    totalElectricityConsumption: extractedData.environmental?.energy_usage?.value || null,
    renewableElectricityConsumption: null, // Not extracted automatically
    totalFuelConsumption: null, // Not extracted automatically  
    carbonEmissions: extractedData.environmental?.carbon_emissions?.value || null,
    
    // Social metrics
    totalEmployees: null, // Not extracted automatically
    femaleEmployees: null, // Will be calculated from percentage if available
    averageTrainingHours: null, // Not extracted automatically
    communityInvestmentSpend: null, // Not extracted automatically
    
    // Governance metrics
    independentBoardMembersPercent: extractedData.governance?.board_independence?.value || null,
    hasDataPrivacyPolicy: null, // Not extracted automatically
    totalRevenue: null, // Not extracted automatically
  };

  // Calculate female employees from percentage if total employees provided
  const femalePercentage = extractedData.social?.diversity_and_inclusion?.female_representation?.value;
  if (femalePercentage && mapped.totalEmployees) {
    mapped.femaleEmployees = Math.round((femalePercentage / 100) * mapped.totalEmployees);
  }

  console.log('✅ Data mapping completed');
  return mapped;
};

router.post('/upload', [authenticateToken, upload.single('file')], async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const { year } = req.body;
        if (!year || isNaN(parseInt(year))) {
            return res.status(400).json({ error: 'Year is required.' });
        }

        console.log('File details:', {
            mimetype: req.file.mimetype,
            size: req.file.size,
            originalName: req.file.originalname,
            bufferLength: req.file.buffer ? req.file.buffer.length : 0
        });

        // Check Gemini API status
        const geminiStatus = await checkGeminiStatus();
        if (!geminiStatus) {
            return res.status(503).json({ 
                error: 'AI service is currently unavailable. Please try again later.',
                fallback: 'You can manually enter the data using the form below.'
            });
        }

        let extractedText;
        
        // Parse file based on type
        if (req.file.mimetype === 'application/pdf') {
            extractedText = await parsePdf(req.file.buffer);
        } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                   req.file.mimetype === 'application/vnd.ms-excel') {
            extractedText = await parseXlsx(req.file.buffer);
        } else {
            return res.status(400).json({ 
                error: 'Unsupported file type. Please upload a PDF or Excel file.',
                supportedTypes: ['PDF (.pdf)', 'Excel (.xlsx, .xls)']
            });
        }

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({ 
                error: 'No readable content found in the uploaded file.',
                suggestion: 'Please ensure the file contains text or data that can be extracted.'
            });
        }

        // Extract ESG data using Gemini AI
        console.log('🤖 Extracting ESG data with Gemini AI...');
        const extractedData = await extractDataWithGemini(extractedText);
        
        if (!extractedData) {
            return res.status(500).json({ 
                error: 'Failed to extract ESG data from the document.',
                suggestion: 'Please try uploading a different document or enter data manually.'
            });
        }

        // Map extracted data to Prisma schema format
        const mappedData = mapExtractedDataToPrisma(extractedData, year);
        
        // Calculate derived metrics
        const derivedMetrics = calculateDerivedMetrics(mappedData);
        
        // Combine base data with derived metrics
        const finalData = {
            ...mappedData,
            ...derivedMetrics,
            userId: req.user.id
        };

        // Save to database
        const response = await prisma.response.upsert({
            where: {
                userId_year: {
                    userId: req.user.id,
                    year: parseInt(year)
                }
            },
            update: finalData,
            create: finalData
        });

        res.json({
            message: 'File processed and data extracted successfully!',
            extractedData: response,
            rawExtractedData: extractedData, // For debugging
            fileDetails: {
                name: req.file.originalname,
                size: req.file.size,
                type: req.file.mimetype,
                year: parseInt(year)
            }
        });
    } catch (error) {
        console.error('File upload error:', error);
        const errorMessage = error.message || 'An unexpected error occurred during file processing.';
        const errorStatus = error.status || 500;
        res.status(errorStatus).json({ 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            suggestion: 'Please try uploading a different document or enter data manually.'
        });
    }
});

// Calculate derived metrics
const calculateDerivedMetrics = (data) => {
  const {
    carbonEmissions,
    totalRevenue,
    renewableElectricityConsumption,
    totalElectricityConsumption,
    femaleEmployees,
    totalEmployees,
    communityInvestmentSpend
  } = data;

  const carbonIntensity = carbonEmissions && totalRevenue 
    ? carbonEmissions / totalRevenue 
    : null;
  
  const renewableElectricityRatio = renewableElectricityConsumption && totalElectricityConsumption
    ? (renewableElectricityConsumption / totalElectricityConsumption) * 100
    : null;
  
  const diversityRatio = femaleEmployees && totalEmployees
    ? (femaleEmployees / totalEmployees) * 100
    : null;
  
  const communitySpendRatio = communityInvestmentSpend && totalRevenue
    ? (communityInvestmentSpend / totalRevenue) * 100
    : null;

  return {
    carbonIntensity,
    renewableElectricityRatio,
    diversityRatio,
    communitySpendRatio
  };
};

// Get all responses for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const responses = await prisma.response.findMany({
      where: { userId: req.user.id },
      orderBy: { year: 'desc' }
    });
    
    res.json({ responses });
  } catch (error) {
    console.error('Get responses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific response by year
router.get('/:year', authenticateToken, async (req, res) => {
  try {
    const { year } = req.params;
    const response = await prisma.response.findUnique({
      where: {
        userId_year: {
          userId: req.user.id,
          year: parseInt(year)
        }
      }
    });
    
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    res.json({ response });
  } catch (error) {
    console.error('Get response error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update response
router.post('/', [
  authenticateToken,
  body('year').isInt({ min: 2000, max: 2100 }).withMessage('Valid year between 2000-2100 is required'),
  body('totalElectricityConsumption').optional().isFloat({ min: 0 }).withMessage('Must be a positive number'),
  body('renewableElectricityConsumption').optional().isFloat({ min: 0 }).withMessage('Must be a positive number'),
  body('totalFuelConsumption').optional().isFloat({ min: 0 }).withMessage('Must be a positive number'),
  body('carbonEmissions').optional().isFloat({ min: 0 }).withMessage('Must be a positive number'),
  body('totalEmployees').optional().isInt({ min: 0 }).withMessage('Must be a positive integer'),
  body('femaleEmployees').optional().isInt({ min: 0 }).withMessage('Must be a positive integer'),
  body('averageTrainingHours').optional().isFloat({ min: 0 }).withMessage('Must be a positive number'),
  body('communityInvestmentSpend').optional().isFloat({ min: 0 }).withMessage('Must be a positive number'),
  body('independentBoardMembersPercent').optional().isFloat({ min: 0, max: 100 }).withMessage('Must be between 0-100'),
  body('hasDataPrivacyPolicy').optional().isBoolean().withMessage('Must be true or false'),
  body('totalRevenue').optional().isFloat({ min: 0 }).withMessage('Must be a positive number')
], handleValidationErrors, async (req, res) => {
  try {
    const derivedMetrics = calculateDerivedMetrics(req.body);
    
    const responseData = {
      ...req.body,
      ...derivedMetrics,
      userId: req.user.id
    };

    const response = await prisma.response.upsert({
      where: {
        userId_year: {
          userId: req.user.id,
          year: responseData.year
        }
      },
      update: responseData,
      create: responseData
    });

    res.json({ 
      message: 'Response saved successfully',
      response 
    });
  } catch (error) {
    console.error('Save response error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update specific response
router.put('/:year', [
  authenticateToken,
  body('totalElectricityConsumption').optional().isFloat({ min: 0 }).withMessage('Must be a positive number'),
  body('renewableElectricityConsumption').optional().isFloat({ min: 0 }).withMessage('Must be a positive number'),
  body('totalFuelConsumption').optional().isFloat({ min: 0 }).withMessage('Must be a positive number'),
  body('carbonEmissions').optional().isFloat({ min: 0 }).withMessage('Must be a positive number'),
  body('totalEmployees').optional().isInt({ min: 0 }).withMessage('Must be a positive integer'),
  body('femaleEmployees').optional().isInt({ min: 0 }).withMessage('Must be a positive integer'),
  body('averageTrainingHours').optional().isFloat({ min: 0 }).withMessage('Must be a positive number'),
  body('communityInvestmentSpend').optional().isFloat({ min: 0 }).withMessage('Must be a positive number'),
  body('independentBoardMembersPercent').optional().isFloat({ min: 0, max: 100 }).withMessage('Must be between 0-100'),
  body('hasDataPrivacyPolicy').optional().isBoolean().withMessage('Must be true or false'),
  body('totalRevenue').optional().isFloat({ min: 0 }).withMessage('Must be a positive number')
], handleValidationErrors, async (req, res) => {
  try {
    const { year } = req.params;
    
    // Check if response exists
    const existingResponse = await prisma.response.findUnique({
      where: {
        userId_year: {
          userId: req.user.id,
          year: parseInt(year)
        }
      }
    });
    
    if (!existingResponse) {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    // Calculate derived metrics for updated data
    const derivedMetrics = calculateDerivedMetrics({
      ...existingResponse,
      ...req.body
    });
    
    const updateData = {
      ...req.body,
      ...derivedMetrics
    };

    const response = await prisma.response.update({
      where: {
        userId_year: {
          userId: req.user.id,
          year: parseInt(year)
        }
      },
      data: updateData
    });

    res.json({ 
      message: 'Response updated successfully',
      response 
    });
  } catch (error) {
    console.error('Update response error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete response
router.delete('/:year', authenticateToken, async (req, res) => {
  try {
    const { year } = req.params;
    
    await prisma.response.delete({
      where: {
        userId_year: {
          userId: req.user.id,
          year: parseInt(year)
        }
      }
    });
    
    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Delete response error:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;