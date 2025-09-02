'use client';

import React from 'react';
import { Building } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ESGResponse, ChartData } from '@/types';

interface GovernanceSectionProps {
  currentData?: ESGResponse;
  previousData?: ESGResponse;
  chartData?: ChartData;
}

export const GovernanceSection: React.FC<GovernanceSectionProps> = ({ 
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
  const boardCompositionData = chartData?.boardComposition?.filter(item => item.value > 0) || 
    (currentData?.independentBoardMembersPercent ? [
      { name: 'Independent', value: currentData.independentBoardMembersPercent },
      { name: 'Non-Independent', value: 100 - currentData.independentBoardMembersPercent }
    ] : []);

  // Check if we have any data to display
  const hasData = currentData && (
    currentData.independentBoardMembersPercent || 
    currentData.hasDataPrivacyPolicy !== undefined || 
    currentData.totalRevenue
  );

  return (
    <div className="space-y-8">
      {!hasData ? (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Governance Data</h3>
          <p className="mt-1 text-sm text-gray-500">
            Fill out the ESG questionnaire to see governance metrics.
          </p>
          <div className="mt-6">
            <a
              href="/questionnaire"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Enter Governance Data
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Board Governance */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Board Governance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Independent Board Members"
                value={`${currentData?.independentBoardMembersPercent?.toFixed(1) || 'N/A'}%`}
                subtitle="Independent Directors"
                trend={calculateTrend(currentData?.independentBoardMembersPercent, previousData?.independentBoardMembersPercent).trend}
                trendValue={calculateTrend(currentData?.independentBoardMembersPercent, previousData?.independentBoardMembersPercent).value}
                chart={boardCompositionData.length > 0 ? {
                  type: 'pie',
                  data: boardCompositionData,
                  colors: ['#8B5CF6', '#A78BFA', '#C4B5FD']
                } : undefined}
              />
            </div>
          </div>

          {/* Ethics & Compliance */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Ethics & Compliance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Data Privacy Policy"
                value={currentData?.hasDataPrivacyPolicy ? 'Yes' : 'No'}
                subtitle="Policy Status"
                trend="neutral"
                trendValue="N/A"
              />
            </div>
          </div>

          {/* Financial Performance */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Total Revenue"
                value={currentData?.totalRevenue?.toLocaleString() || 'N/A'}
                subtitle="INR"
                trend={calculateTrend(currentData?.totalRevenue, previousData?.totalRevenue).trend}
                trendValue={calculateTrend(currentData?.totalRevenue, previousData?.totalRevenue).value}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
