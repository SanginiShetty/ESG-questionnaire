'use client';

import React from 'react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'environment', label: 'Environment', color: 'green' },
  { id: 'social', label: 'Social', color: 'blue' },
  { id: 'governance', label: 'Governance', color: 'purple' },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const getTabStyles = (tabId: string, color: string) => {
    const isActive = activeTab === tabId;
    
    const colorClasses = {
      green: {
        active: 'bg-green-100 text-green-700 border-green-300',
        inactive: 'text-gray-500 hover:text-green-600 hover:bg-green-50'
      },
      blue: {
        active: 'bg-blue-100 text-blue-700 border-blue-300',
        inactive: 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
      },
      purple: {
        active: 'bg-purple-100 text-purple-700 border-purple-300',
        inactive: 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
      }
    };

    return isActive 
      ? `border ${colorClasses[color as keyof typeof colorClasses].active}`
      : colorClasses[color as keyof typeof colorClasses].inactive;
  };

  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors ${getTabStyles(tab.id, tab.color)}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
