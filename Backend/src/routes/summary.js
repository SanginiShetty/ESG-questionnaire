const express = require('express');
const prisma = require('../utils/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get summary data for dashboard
router.get('/', authenticateToken, async (req, res) => {
  try {
    const responses = await prisma.response.findMany({
      where: { userId: req.user.id },
      orderBy: { year: 'asc' }
    });
    
    // Calculate summary statistics
    const summary = {
      totalRecords: responses.length,
      years: responses.map(r => r.year),
      environmental: {
        avgCarbonIntensity: calculateAverage(responses.map(r => r.carbonIntensity)),
        avgRenewableRatio: calculateAverage(responses.map(r => r.renewableElectricityRatio)),
        totalEmissions: calculateSum(responses.map(r => r.carbonEmissions))
      },
      social: {
        avgDiversityRatio: calculateAverage(responses.map(r => r.diversityRatio)),
        avgCommunitySpend: calculateAverage(responses.map(r => r.communitySpendRatio)),
        totalCommunitySpend: calculateSum(responses.map(r => r.communityInvestmentSpend))
      },
      governance: {
        avgIndependentBoard: calculateAverage(responses.map(r => r.independentBoardMembersPercent)),
        dataPrivacyPolicyCount: responses.filter(r => r.hasDataPrivacyPolicy === true).length
      }
    };
    
    res.json({ summary });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get chart data for dashboard
router.get('/charts', authenticateToken, async (req, res) => {
  try {
    const responses = await prisma.response.findMany({
      where: { userId: req.user.id },
      orderBy: { year: 'asc' }
    });

    if (responses.length === 0) {
      return res.json({ chartData: null });
    }

    // Calculate dynamic chart data based on actual user data
    const chartData = {
      carbonEmissions: {
        breakdown: calculateCarbonBreakdown(responses)
      },
      energyConsumption: {
        renewable: calculateAverage(responses.map(r => r.renewableElectricityConsumption)) || 0,
        total: calculateAverage(responses.map(r => r.totalElectricityConsumption)) || 0,
        fuelConsumption: calculateAverage(responses.map(r => r.totalFuelConsumption)) || 0,
        breakdown: calculateEnergyBreakdown(responses)
      },
      diversityBreakdown: calculateDiversityBreakdown(responses),
      yearlyTrends: responses.map(r => ({
        year: r.year,
        carbonIntensity: r.carbonIntensity || 0,
        renewableRatio: r.renewableElectricityRatio || 0,
        diversityRatio: r.diversityRatio || 0,
        communitySpendRatio: r.communitySpendRatio || 0,
        carbonEmissions: r.carbonEmissions || 0,
        totalEmployees: r.totalEmployees || 0
      })),
      communityInvestment: calculateCommunityInvestmentBreakdown(responses),
      boardComposition: calculateBoardComposition(responses),
      employeeMetrics: {
        totalEmployees: calculateSum(responses.map(r => r.totalEmployees)) || 0,
        avgTrainingHours: calculateAverage(responses.map(r => r.averageTrainingHours)) || 0,
        totalCommunitySpend: calculateSum(responses.map(r => r.communityInvestmentSpend)) || 0
      },
      governanceMetrics: {
        avgIndependentBoard: calculateAverage(responses.map(r => r.independentBoardMembersPercent)) || 0,
        dataPrivacyCompliance: (responses.filter(r => r.hasDataPrivacyPolicy === true).length / responses.length) * 100,
        avgRevenue: calculateAverage(responses.map(r => r.totalRevenue)) || 0
      }
    };

    res.json({ chartData });
  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enhanced helper functions for dynamic chart calculations
function calculateCarbonBreakdown(responses) {
  const avgEmissions = calculateAverage(responses.map(r => r.carbonEmissions)) || 0;
  const avgElectricity = calculateAverage(responses.map(r => r.totalElectricityConsumption)) || 0;
  const avgFuel = calculateAverage(responses.map(r => r.totalFuelConsumption)) || 0;
  
  if (avgEmissions === 0) return [];
  
  // Calculate proportional breakdown based on energy consumption
  const totalEnergy = avgElectricity + avgFuel;
  if (totalEnergy === 0) {
    return [{ name: 'Total Emissions', value: avgEmissions }];
  }
  
  const electricityRatio = avgElectricity / totalEnergy;
  const fuelRatio = avgFuel / totalEnergy;
  
  return [
    { name: 'Electricity Related', value: avgEmissions * electricityRatio },
    { name: 'Fuel Combustion', value: avgEmissions * fuelRatio },
    { name: 'Other Sources', value: avgEmissions * 0.1 } // Small portion for other sources
  ].filter(item => item.value > 0);
}

function calculateEnergyBreakdown(responses) {
  const avgTotal = calculateAverage(responses.map(r => r.totalElectricityConsumption)) || 0;
  const avgRenewable = calculateAverage(responses.map(r => r.renewableElectricityConsumption)) || 0;
  const avgFuel = calculateAverage(responses.map(r => r.totalFuelConsumption)) || 0;
  
  const breakdown = [];
  if (avgTotal > 0) breakdown.push({ name: 'Electricity', value: avgTotal });
  if (avgFuel > 0) breakdown.push({ name: 'Fuel', value: avgFuel });
  if (avgRenewable > 0) breakdown.push({ name: 'Renewable', value: avgRenewable });
  
  return breakdown;
}

function calculateDiversityBreakdown(responses) {
  const avgDiversityRatio = calculateAverage(responses.map(r => r.diversityRatio)) || 0;
  
  if (avgDiversityRatio === 0) return [];
  
  return [
    { name: 'Female', value: avgDiversityRatio },
    { name: 'Male', value: 100 - avgDiversityRatio }
  ];
}

function calculateCommunityInvestmentBreakdown(responses) {
  const totalSpend = calculateSum(responses.map(r => r.communityInvestmentSpend)) || 0;
  
  if (totalSpend === 0) return [];
  
  // For now, return proportional breakdown - this could be enhanced with actual category data
  return [
    { name: 'Education', value: totalSpend * 0.4 },
    { name: 'Healthcare', value: totalSpend * 0.3 },
    { name: 'Environment', value: totalSpend * 0.2 },
    { name: 'Sports & Culture', value: totalSpend * 0.1 }
  ];
}

function calculateBoardComposition(responses) {
  const avgIndependent = calculateAverage(responses.map(r => r.independentBoardMembersPercent)) || 0;
  
  if (avgIndependent === 0) return [];
  
  return [
    { name: 'Independent', value: avgIndependent },
    { name: 'Non-Independent', value: 100 - avgIndependent }
  ];
}

// Helper functions
function calculateAverage(values) {
  const validValues = values.filter(v => v !== null && !isNaN(v));
  if (validValues.length === 0) return null;
  return validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
}

function calculateSum(values) {
  const validValues = values.filter(v => v !== null && !isNaN(v));
  if (validValues.length === 0) return null;
  return validValues.reduce((sum, val) => sum + val, 0);
}

module.exports = router;