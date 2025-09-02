import React from 'react';

interface CalculatedMetricsProps {
  values: {
    carbonEmissions?: number;
    totalRevenue?: number;
    renewableElectricityConsumption?: number;
    totalElectricityConsumption?: number;
    femaleEmployees?: number;
    totalEmployees?: number;
    communityInvestmentSpend?: number;
  };
}

export const CalculatedMetrics: React.FC<CalculatedMetricsProps> = ({ values }) => {
  const calculateCarbonIntensity = () => {
    if (values.carbonEmissions && values.totalRevenue && values.totalRevenue > 0) {
      return (values.carbonEmissions / values.totalRevenue).toFixed(4);
    }
    return 'N/A';
  };

  const calculateRenewableRatio = () => {
    if (values.renewableElectricityConsumption && values.totalElectricityConsumption && values.totalElectricityConsumption > 0) {
      return ((values.renewableElectricityConsumption / values.totalElectricityConsumption) * 100).toFixed(2);
    }
    return 'N/A';
  };

  const calculateDiversityRatio = () => {
    if (values.femaleEmployees && values.totalEmployees && values.totalEmployees > 0) {
      return ((values.femaleEmployees / values.totalEmployees) * 100).toFixed(2);
    }
    return 'N/A';
  };

  const calculateCommunitySpendRatio = () => {
    if (values.communityInvestmentSpend && values.totalRevenue && values.totalRevenue > 0) {
      return ((values.communityInvestmentSpend / values.totalRevenue) * 100).toFixed(2);
    }
    return 'N/A';
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Auto-Calculated Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Carbon Intensity</h4>
          <p className="text-xs text-gray-500 mb-2">Formula: Carbon Emissions / Total Revenue</p>
          <p className="text-2xl font-bold text-primary-600">{calculateCarbonIntensity()}</p>
          <p className="text-sm text-gray-500">T CO2e / INR</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Renewable Electricity Ratio</h4>
          <p className="text-xs text-gray-500 mb-2">Formula: (Renewable / Total Electricity) × 100%</p>
          <p className="text-2xl font-bold text-green-600">{calculateRenewableRatio()}%</p>
          <p className="text-sm text-gray-500">% of total electricity</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Diversity Ratio</h4>
          <p className="text-xs text-gray-500 mb-2">Formula: (Female Employees / Total Employees) × 100%</p>
          <p className="text-2xl font-bold text-blue-600">{calculateDiversityRatio()}%</p>
          <p className="text-sm text-gray-500">% female employees</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Community Spend Ratio</h4>
          <p className="text-xs text-gray-500 mb-2">Formula: (Community Investment / Total Revenue) × 100%</p>
          <p className="text-2xl font-bold text-purple-600">{calculateCommunitySpendRatio()}%</p>
          <p className="text-sm text-gray-500">% of total revenue</p>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>* These metrics are calculated automatically based on your inputs</p>
        <p>* All ratios require both numerator and denominator values to be entered</p>
      </div>
    </div>
  );
};