'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ESGResponse, ChartData } from '@/types';

interface EnvironmentSectionProps {
  currentData?: ESGResponse;
  previousData?: ESGResponse;
  chartData?: ChartData;
}

export const EnvironmentSection: React.FC<EnvironmentSectionProps> = ({ 
  currentData, 
  previousData,
  chartData 
}) => {
  const calculateTrend = (current: number | undefined, previous: number | undefined) => {
    if (!current || !previous || previous === 0) return { trend: 'neutral' as const, value: 'N/A' };
    
    const change = ((current - previous) / previous) * 100;
    if (change > 0) return { trend: 'up' as const, value: `+${change.toFixed(1)}%` };
    if (change < 0) return { trend: 'down' as const, value: `${change.toFixed(1)}%` };
    return { trend: 'neutral' as const, value: '0%' };
  };


  // Chart data - use dynamic data when available, show empty states when no data
  const carbonEmissionsBreakdown = chartData?.carbonEmissions?.breakdown?.filter(item => item.value > 0) || [];

  const energyBreakdown = currentData?.renewableElectricityRatio && currentData?.totalElectricityConsumption ? [
    { name: 'Renewable', value: currentData.renewableElectricityRatio },
    { name: 'Non-Renewable', value: 100 - currentData.renewableElectricityRatio },
  ] : [];

  const energySourcesData = chartData?.energyConsumption ? [
    { name: 'Electricity', value: chartData.energyConsumption.total },
    { name: 'Fuel', value: chartData.energyConsumption.fuelConsumption },
  ].filter(item => item.value > 0) : [
    { name: 'Electricity', value: currentData?.totalElectricityConsumption || 0 },
    { name: 'Fuel', value: currentData?.totalFuelConsumption || 0 },
  ].filter(item => item.value > 0);

  const totalEmissions = currentData?.carbonEmissions || 0;
  const totalEmissionsPrevious = previousData?.carbonEmissions || 0;

  // Check if we have any data to display
  const hasData = currentData && (
    currentData.carbonEmissions || 
    currentData.totalElectricityConsumption || 
    currentData.renewableElectricityConsumption || 
    currentData.totalFuelConsumption
  );

  return (
    <div className="space-y-8">
      {!hasData ? (
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Environmental Data</h3>
          <p className="mt-1 text-sm text-gray-500">
            Fill out the ESG questionnaire to see environmental metrics.
          </p>
          <div className="mt-6">
            <a
              href="/questionnaire"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Enter Environmental Data
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Carbon Emissions Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Carbon Emissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Total Carbon Emissions"
                value={totalEmissions ? `${totalEmissions.toFixed(1)}` : 'N/A'}
                subtitle="T CO2e"
                trend={calculateTrend(totalEmissions, totalEmissionsPrevious).trend}
                trendValue={calculateTrend(totalEmissions, totalEmissionsPrevious).value}
                chart={carbonEmissionsBreakdown.length > 0 ? {
                  type: 'pie',
                  data: carbonEmissionsBreakdown,
                  colors: ['#EF4444', '#F97316', '#F59E0B']
                } : undefined}
              />
              
              <MetricCard
                title="Carbon Intensity"
                value={currentData?.carbonIntensity?.toFixed(4) || 'N/A'}
                subtitle="T CO2e / INR"
                trend={calculateTrend(currentData?.carbonIntensity, previousData?.carbonIntensity).trend}
                trendValue={calculateTrend(currentData?.carbonIntensity, previousData?.carbonIntensity).value}
              />
              
              <MetricCard
                title="Direct Carbon Emissions"
                value={currentData?.carbonEmissions?.toFixed(1) || 'N/A'}
                subtitle="T CO2e"
                trend={calculateTrend(currentData?.carbonEmissions, previousData?.carbonEmissions).trend}
                trendValue={calculateTrend(currentData?.carbonEmissions, previousData?.carbonEmissions).value}
              />
            </div>
          </div>

          {/* Energy Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Energy Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Total Electricity Consumption"
                value={currentData?.totalElectricityConsumption?.toFixed(0) || 'N/A'}
                subtitle="kWh"
                trend={calculateTrend(currentData?.totalElectricityConsumption, previousData?.totalElectricityConsumption).trend}
                trendValue={calculateTrend(currentData?.totalElectricityConsumption, previousData?.totalElectricityConsumption).value}
                chart={energyBreakdown.length > 0 ? {
                  type: 'pie',
                  data: energyBreakdown,
                  colors: ['#10B981', '#6B7280']
                } : undefined}
              />
              
              <MetricCard
                title="Renewable Energy Ratio"
                value={currentData?.renewableElectricityRatio?.toFixed(1) || 'N/A'}
                subtitle="% of total"
                trend={calculateTrend(currentData?.renewableElectricityRatio, previousData?.renewableElectricityRatio).trend}
                trendValue={calculateTrend(currentData?.renewableElectricityRatio, previousData?.renewableElectricityRatio).value}
              />
              
              <MetricCard
                title="Total Fuel Consumption"
                value={currentData?.totalFuelConsumption?.toFixed(1) || 'N/A'}
                subtitle="Liters"
                trend={calculateTrend(currentData?.totalFuelConsumption, previousData?.totalFuelConsumption).trend}
                trendValue={calculateTrend(currentData?.totalFuelConsumption, previousData?.totalFuelConsumption).value}
              />
            </div>
          </div>

          {/* Energy Sources Breakdown */}
          {energySourcesData.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Energy Sources Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetricCard
                  title="Energy by Source"
                  value="100%"
                  subtitle="Total Energy Mix"
                  chart={{
                    type: 'bar',
                    data: energySourcesData,
                    colors: ['#10B981']
                  }}
                  className="md:col-span-2"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
