'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface DataEntryGuideProps {
  className?: string;
}

export const DataEntryGuide: React.FC<DataEntryGuideProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const fields = [
    {
      category: 'Environmental Metrics',
      color: 'green',
      fields: [
        { name: 'Total Electricity Consumption', unit: 'kWh', description: 'Total electricity consumed by your organization' },
        { name: 'Renewable Electricity Consumption', unit: 'kWh', description: 'Electricity from renewable sources (solar, wind, etc.)' },
        { name: 'Total Fuel Consumption', unit: 'liters', description: 'Fuel consumption for vehicles, generators, etc.' },
        { name: 'Carbon Emissions', unit: 'T CO2e', description: 'Total carbon dioxide equivalent emissions' }
      ]
    },
    {
      category: 'Social Responsibility',
      color: 'blue',
      fields: [
        { name: 'Total Employees', unit: 'count', description: 'Total number of employees in your organization' },
        { name: 'Female Employees', unit: 'count', description: 'Number of female employees' },
        { name: 'Average Training Hours', unit: 'hours', description: 'Average training hours per employee per year' },
        { name: 'Community Investment Spend', unit: 'INR', description: 'Total amount spent on community initiatives' }
      ]
    },
    {
      category: 'Governance',
      color: 'purple',
      fields: [
        { name: 'Independent Board Members', unit: '%', description: 'Percentage of independent board members' },
        { name: 'Data Privacy Policy', unit: 'Yes/No', description: 'Whether your organization has a data privacy policy' },
        { name: 'Total Revenue', unit: 'INR', description: 'Total revenue for the financial year' }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800'
    };
    return colors[color as keyof typeof colors] || colors.green;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div 
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">Data Entry Guide</h3>
          <span className="text-sm text-gray-500">Click to {isExpanded ? 'collapse' : 'expand'}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-6">
          <p className="text-sm text-gray-600">
            Fill out the fields below to track your ESG performance. All calculated metrics (ratios, intensities) 
            will be automatically computed based on your input data.
          </p>

          {fields.map((category, index) => (
            <div key={index}>
              <h4 className={`text-sm font-medium px-3 py-1 rounded-md inline-block mb-3 ${getColorClasses(category.color)}`}>
                {category.category}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-900">{field.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {field.unit}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{field.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="text-sm font-medium text-yellow-800 mb-2">Automatically Calculated Metrics</h5>
            <div className="text-xs text-yellow-700 space-y-1">
              <p>• <strong>Carbon Intensity:</strong> Carbon Emissions ÷ Total Revenue</p>
              <p>• <strong>Renewable Electricity Ratio:</strong> (Renewable Consumption ÷ Total Consumption) × 100</p>
              <p>• <strong>Diversity Ratio:</strong> (Female Employees ÷ Total Employees) × 100</p>
              <p>• <strong>Community Spend Ratio:</strong> (Community Investment ÷ Total Revenue) × 100</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
