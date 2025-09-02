'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartData } from '@/types';

interface TrendsChartProps {
  chartData?: ChartData;
  className?: string;
}

export const TrendsChart: React.FC<TrendsChartProps> = ({ chartData, className = '' }) => {
  if (!chartData || !chartData.yearlyTrends || chartData.yearlyTrends.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Yearly Trends</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No trend data available. Add data for multiple years to see trends.</p>
        </div>
      </div>
    );
  }

  const trends = chartData.yearlyTrends;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">ESG Performance Trends</h2>
      
      <div className="space-y-8">
        {/* Environmental Trends */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Environmental Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="carbonIntensity" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Carbon Intensity"
                />
                <Line 
                  type="monotone" 
                  dataKey="renewableRatio" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Renewable Ratio (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Social Trends */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Social Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="diversityRatio" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Diversity Ratio (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="communitySpendRatio" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Community Spend Ratio (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Growth */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Employee Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalEmployees" fill="#06B6D4" name="Total Employees" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Carbon Emissions Trend */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Carbon Emissions Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="carbonEmissions" fill="#EF4444" name="Carbon Emissions (T CO2e)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
