'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  chart?: {
    type: 'pie' | 'bar';
    data: any[];
    colors?: string[];
  };
  className?: string;
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'];

const defaultPieColors = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  chart,
  className = ''
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
          </div>
        </div>
      </div>

      {/* Trend */}
      {trend && trendValue && (
        <div className="flex items-center space-x-1 mb-4">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {trendValue}
          </span>
          <span className="text-sm text-gray-500">vs last year</span>
        </div>
      )}

      {/* Chart */}
      {chart && (
        <div className="mt-4">
          {chart.type === 'pie' && (
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chart.data}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chart.data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={chart.colors?.[index] || defaultPieColors[index % defaultPieColors.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {chart.type === 'bar' && (
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart.data}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis hide />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill={chart.colors?.[0] || '#10B981'}
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {/* Chart Legend for Pie Charts */}
          {chart.type === 'pie' && chart.data.length > 0 && (
            <div className="mt-3 space-y-1">
              {chart.data.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        backgroundColor: chart.colors?.[index] || defaultPieColors[index % defaultPieColors.length] 
                      }}
                    />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
