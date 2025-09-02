const express = require('express');
const { body } = require('express-validator');
const prisma = require('../utils/prisma');
const { handleValidationErrors } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

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