'use client';

import React from 'react';
import { MetricCard } from './MetricCard';
import { ESGResponse, ChartData } from '@/types';
import { Users } from 'lucide-react';

interface SocialSectionProps {
  currentData?: ESGResponse;
  previousData?: ESGResponse;
  chartData?: ChartData;
}

export const SocialSection: React.FC<SocialSectionProps> = ({ 
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
  const diversityBreakdown = chartData?.diversityBreakdown?.filter(item => item.value > 0) || 
    (currentData?.diversityRatio ? [
      { name: 'Female', value: currentData.diversityRatio },
      { name: 'Male', value: 100 - currentData.diversityRatio },
    ] : []);

  const communityInvestmentData = chartData?.communityInvestment?.filter(item => item.value > 0) || [];

  // Check if we have any data to display
  const hasData = currentData && (
    currentData.totalEmployees || 
    currentData.femaleEmployees || 
    currentData.averageTrainingHours || 
    currentData.communityInvestmentSpend ||
    currentData.diversityRatio
  );

  return (
    <div className="space-y-8">
      {!hasData ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Social Data</h3>
          <p className="mt-1 text-sm text-gray-500">
            Fill out the ESG questionnaire to see social responsibility metrics.
          </p>
          <div className="mt-6">
            <a
              href="/questionnaire"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Enter Social Data
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Workforce Diversity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Workforce Diversity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Gender Diversity Ratio"
                value={currentData?.diversityRatio?.toFixed(1) || 'N/A'}
                subtitle="% Female Employees"
                trend={calculateTrend(currentData?.diversityRatio, previousData?.diversityRatio).trend}
                trendValue={calculateTrend(currentData?.diversityRatio, previousData?.diversityRatio).value}
                chart={diversityBreakdown.length > 0 ? {
                  type: 'pie',
                  data: diversityBreakdown,
                  colors: ['#8B5CF6', '#A78BFA']
                } : undefined}
              />
              
              <MetricCard
                title="Total Employees"
                value={currentData?.totalEmployees?.toLocaleString() || 'N/A'}
                subtitle="Full-time Equivalent"
                trend={calculateTrend(currentData?.totalEmployees, previousData?.totalEmployees).trend}
                trendValue={calculateTrend(currentData?.totalEmployees, previousData?.totalEmployees).value}
              />
              
              <MetricCard
                title="Female Employees"
                value={currentData?.femaleEmployees?.toLocaleString() || 'N/A'}
                subtitle="Count"
                trend={calculateTrend(currentData?.femaleEmployees, previousData?.femaleEmployees).trend}
                trendValue={calculateTrend(currentData?.femaleEmployees, previousData?.femaleEmployees).value}
              />
            </div>
          </div>

          {/* Employee Development */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Employee Development</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Training Hours per Employee"
                value={currentData?.averageTrainingHours?.toFixed(1) || 'N/A'}
                subtitle="Hours/Year"
                trend={calculateTrend(currentData?.averageTrainingHours, previousData?.averageTrainingHours).trend}
                trendValue={calculateTrend(currentData?.averageTrainingHours, previousData?.averageTrainingHours).value}
              />
            </div>
          </div>

          {/* Community Investment */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Community Investment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Community Spend Ratio"
                value={currentData?.communitySpendRatio?.toFixed(2) || 'N/A'}
                subtitle="% of Revenue"
                trend={calculateTrend(currentData?.communitySpendRatio, previousData?.communitySpendRatio).trend}
                trendValue={calculateTrend(currentData?.communitySpendRatio, previousData?.communitySpendRatio).value}
                chart={communityInvestmentData.length > 0 ? {
                  type: 'pie',
                  data: communityInvestmentData,
                  colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0']
                } : undefined}
              />
              
              <MetricCard
                title="Community Investment Spend"
                value={currentData?.communityInvestmentSpend?.toLocaleString() || 'N/A'}
                subtitle="INR"
                trend={calculateTrend(currentData?.communityInvestmentSpend, previousData?.communityInvestmentSpend).trend}
                trendValue={calculateTrend(currentData?.communityInvestmentSpend, previousData?.communityInvestmentSpend).value}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
