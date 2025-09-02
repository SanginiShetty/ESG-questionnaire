import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ESGResponse } from '@/types';

interface ChartsProps {
  responses: ESGResponse[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const Charts: React.FC<ChartsProps> = ({ responses }) => {
  const chartData = responses
    .filter(r => r.year && r.carbonIntensity !== undefined)
    .sort((a, b) => a.year! - b.year!)
    .map(r => ({
      year: r.year,
      carbonIntensity: r.carbonIntensity,
      renewableRatio: r.renewableElectricityRatio,
      diversityRatio: r.diversityRatio,
      communitySpend: r.communitySpendRatio,
    }));

  const latestData = responses[responses.length - 1];
  const pieData = [
    { name: 'Carbon Intensity', value: latestData?.carbonIntensity || 0 },
    { name: 'Renewable Ratio', value: latestData?.renewableElectricityRatio || 0 },
    { name: 'Diversity Ratio', value: latestData?.diversityRatio || 0 },
    { name: 'Community Spend', value: latestData?.communitySpendRatio || 0 },
  ].filter(item => item.value > 0);

  if (responses.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No data available for charts. Complete the questionnaire to see visualizations.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart - Trends over time */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">ESG Metrics Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="carbonIntensity" stroke="#0088FE" name="Carbon Intensity" />
            <Line type="monotone" dataKey="renewableRatio" stroke="#00C49F" name="Renewable Ratio %" />
            <Line type="monotone" dataKey="diversityRatio" stroke="#FFBB28" name="Diversity Ratio %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Community Spend */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Community Spend Ratio</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="communitySpend" fill="#FF8042" name="Community Spend %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Latest Year Distribution */}
      {pieData.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Metrics Distribution (Latest Year)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};