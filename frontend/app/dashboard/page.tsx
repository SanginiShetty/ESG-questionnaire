'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { YearSelector } from '@/components/dashboard/YearSelector';
import { ExportButtons } from '@/components/dashboard/ExportButtons';
import { TrendsChart } from '@/components/dashboard/TrendsChart';
import { responseApi, summaryApi } from '@/lib/api';
import { useChartData } from '@/hooks/useChartData';
import { ESGResponse, SummaryData } from '@/types';
import { Loader } from '@/components/ui/Loader';
import { Users, Globe } from 'lucide-react';

export default function DashboardPage() {
  const [responses, setResponses] = useState<ESGResponse[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [activeMainTab, setActiveMainTab] = useState('dashboard');
  const router = useRouter();
  
  const { chartData } = useChartData();

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    try {
      setLoading(true);
      const [{ responses: data }, { summary: summaryData }] = await Promise.all([
        responseApi.getAll(),
        summaryApi.getSummary()
      ]);
      
      setResponses(data);
      setSummary(summaryData);
      
      if (data.length > 0) {
        const years = data.map(r => r.year).sort((a, b) => b - a);
        setAvailableYears(years);
        setSelectedYear(years[0]);
      } else {
        setAvailableYears([new Date().getFullYear()]);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewYear = () => {
    const newYear = Math.max(...availableYears, new Date().getFullYear()) + 1;
    setAvailableYears([...availableYears, newYear].sort((a, b) => b - a));
    setSelectedYear(newYear);
  };

  const currentYearData = responses.find(r => r.year === selectedYear);
  const previousYearData = responses.find(r => r.year === selectedYear - 1);

  const calculateTrend = (current: number | undefined, previous: number | undefined) => {
    if (!current || !previous || previous === 0) return { trend: 'neutral' as const, value: 'N/A' };
    
    const change = ((current - previous) / previous) * 100;
    if (change > 0) return { trend: 'up' as const, value: `+${change.toFixed(1)}%` };
    if (change < 0) return { trend: 'down' as const, value: `${change.toFixed(1)}%` };
    return { trend: 'neutral' as const, value: '0%' };
  };

  const handleMainTabChange = (tab: string) => {
    if (tab === 'questionnaire') {
      router.push('/questionnaire');
    } else if (tab === 'summary') {
      router.push('/summary');
    } else {
      setActiveMainTab(tab);
    }
  };

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">ESG Dashboard Overview</h1>
        {responses.length > 0 && summary && (
          <ExportButtons 
            responses={responses} 
            summary={summary}
            className="flex-shrink-0"
          />
        )}
      </div>

      <YearSelector
        selectedYear={selectedYear}
        availableYears={availableYears}
        onYearChange={setSelectedYear}
        onAddNewYear={handleAddNewYear}
      />

      {responses.length === 0 ? (
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No ESG data yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by filling out your first ESG questionnaire.
          </p>
          <div className="mt-6">
            <a
              href="/questionnaire"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Start Questionnaire
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Carbon Intensity"
              value={currentYearData?.carbonIntensity?.toFixed(4) || 'N/A'}
              subtitle="T CO2e / INR"
              trend={calculateTrend(currentYearData?.carbonIntensity, previousYearData?.carbonIntensity).trend}
              trendValue={calculateTrend(currentYearData?.carbonIntensity, previousYearData?.carbonIntensity).value}
            />
            
            <MetricCard
              title="Renewable Ratio"
              value={currentYearData?.renewableElectricityRatio?.toFixed(1) || 'N/A'}
              subtitle="% of total electricity"
              trend={calculateTrend(currentYearData?.renewableElectricityRatio, previousYearData?.renewableElectricityRatio).trend}
              trendValue={calculateTrend(currentYearData?.renewableElectricityRatio, previousYearData?.renewableElectricityRatio).value}
            />
            
            <MetricCard
              title="Diversity Ratio"
              value={currentYearData?.diversityRatio?.toFixed(1) || 'N/A'}
              subtitle="% female employees"
              trend={calculateTrend(currentYearData?.diversityRatio, previousYearData?.diversityRatio).trend}
              trendValue={calculateTrend(currentYearData?.diversityRatio, previousYearData?.diversityRatio).value}
            />
            
            <MetricCard
              title="Community Spend"
              value={currentYearData?.communitySpendRatio?.toFixed(2) || 'N/A'}
              subtitle="% of revenue"
              trend={calculateTrend(currentYearData?.communitySpendRatio, previousYearData?.communitySpendRatio).trend}
              trendValue={calculateTrend(currentYearData?.communitySpendRatio, previousYearData?.communitySpendRatio).value}
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/questionnaire"
                className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <Globe className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Add ESG Data</h3>
                    <p className="text-sm text-gray-500">Fill out the ESG questionnaire</p>
                  </div>
                </div>
              </a>
              
              <a
                href="/summary"
                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">View Summary</h3>
                    <p className="text-sm text-gray-500">See detailed ESG reports</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
          {/* Trends Chart */}
          {chartData && chartData.yearlyTrends && chartData.yearlyTrends.length > 1 && (
            <TrendsChart chartData={chartData} />
          )}
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <Loader size="lg" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeTab={activeMainTab} onTabChange={handleMainTabChange} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
        {activeMainTab === 'dashboard' && renderDashboardOverview()}
        
        {activeMainTab === 'settings' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          </div>
        )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
