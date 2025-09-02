// backend/models/Response.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Response = sequelize.define('Response', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // Environmental metrics
  totalElectricityConsumption: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  renewableElectricityConsumption: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  totalFuelConsumption: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  carbonEmissions: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  // Social metrics
  totalEmployees: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  femaleEmployees: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  avgTrainingHours: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  communityInvestmentSpend: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  // Governance metrics
  independentBoardMembersPercent: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  hasDataPrivacyPolicy: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  totalRevenue: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  // Auto-calculated metrics
  carbonIntensity: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  renewableElectricityRatio: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  diversityRatio: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  communitySpendRatio: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'year']
    }
  ]
});

module.exports = Response;