const express = require('express');
const { body } = require('express-validator');
const prisma = require('../utils/prisma');
const { handleValidationErrors } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const { parsePdf, parseXlsx, extractDataWithGemini } = require('../utils/parser');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', [authenticateToken, upload.single('file')], async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const { year } = req.body;
        if (!year || isNaN(parseInt(year))) {
            return res.status(400).json({ error: 'Year is required.' });
        }

    let text;
    console.log('File details:', {
      mimetype: req.file.mimetype,
      size: req.file.size,
      originalName: req.file.originalname,
      bufferLength: req.file.buffer ? req.file.buffer.length : 0
    });

    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({ error: 'Uploaded file is empty' });
    }

    if (req.file.mimetype === 'application/pdf') {
      try {
        text = await parsePdf(Buffer.from(req.file.buffer));
      } catch (error) {
        return res.status(400).json({ 
          error: error.message,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      try {
        text = await parseXlsx(req.file.buffer);
      } catch (error) {
        return res.status(400).json({ 
          error: 'Failed to parse Excel file. Please ensure it is a valid .xlsx file.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or Excel file.' });
    }

        const extractedData = await extractDataWithGemini(text);

        const responseData = {
            year: parseInt(year),
            userId: req.user.id,
            carbonEmissions: extractedData.environmental.carbon_emissions.value,
            waterConsumption: extractedData.environmental.water_consumption.value,
            energyUsage: extractedData.environmental.energy_usage.value,
            wasteGenerated: extractedData.environmental.waste_generated.value,
            employeeTurnoverRate: extractedData.social.employee_turnover_rate.value,
            workplaceAccidents: extractedData.social.workplace_accidents.value,
            femaleRepresentation: extractedData.social.diversity_and_inclusion.female_representation.value,
            minorityRepresentation: extractedData.social.diversity_and_inclusion.minority_representation.value,
            boardIndependence: extractedData.governance.board_independence.value,
            executiveCompensationRatio: extractedData.governance.executive_compensation_ratio.value,
        };

        const response = await prisma.response.upsert({
            where: {
                userId_year: {
                    userId: req.user.id,
                    year: responseData.year,
                },
            },
            update: responseData,
            create: responseData,
        });

        res.json({
            message: 'File processed and data saved successfully',
            response,
        });
    } catch (error) {
        console.error('File upload error:', error);
        const errorMessage = error.message || 'An unexpected error occurred during file processing.';
        const errorStatus = error.status || 500;
        res.status(errorStatus).json({ 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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