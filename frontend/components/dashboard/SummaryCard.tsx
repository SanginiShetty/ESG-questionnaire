

import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactElement<any>;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  variant?: 'default' | 'gradient' | 'elevated';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  color = 'primary',
  variant = 'default'
}) => {
  const colorClasses = {
    primary: {
      icon: 'text-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-blue-100/50',
      accent: 'from-blue-500 to-indigo-600',
      iconShadow: 'shadow-lg shadow-blue-200/40'
    },
    success: {
      icon: 'text-emerald-600 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 shadow-emerald-100/50',
      accent: 'from-emerald-500 to-teal-600',
      iconShadow: 'shadow-lg shadow-emerald-200/40'
    },
    warning: {
      icon: 'text-amber-600 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 shadow-amber-100/50',
      accent: 'from-amber-500 to-orange-600',
      iconShadow: 'shadow-lg shadow-amber-200/40'
    },
    danger: {
      icon: 'text-red-600 bg-gradient-to-br from-red-50 to-rose-50 border-red-100 shadow-red-100/50',
      accent: 'from-red-500 to-rose-600',
      iconShadow: 'shadow-lg shadow-red-200/40'
    },
  };

  const trendColors = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-slate-600 bg-slate-50',
  };

  // Add missing trendIcons object
  const trendIcons = {
    up: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    down: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path d="M17 10l-5 5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    neutral: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  };

  const getCardClasses = () => {
    const baseClasses = 'group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1';
    
    switch (variant) {
      case 'gradient':
        return `${baseClasses} bg-gradient-to-br from-white via-gray-50/50 to-gray-100/30 border border-gray-200/60 rounded-2xl shadow-lg backdrop-blur-sm`;
      case 'elevated':
        return `${baseClasses} bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl`;
      default:
        return `${baseClasses} bg-white rounded-xl shadow-md border border-gray-200/50 hover:border-gray-300`;
    }
  };

  return (
    <div className={getCardClasses()}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-gray-50/20 opacity-60"></div>
      
      {/* Colored accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorClasses[color].accent}`}></div>
      
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Title with subtle animation */}
            <div className="flex items-center space-x-2 mb-3">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {title}
              </p>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colorClasses[color].accent} opacity-60`}></div>
            </div>
            {/* Value with enhanced typography */}
            <p className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 leading-none">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-500 font-medium">
                {subtitle}
              </p>
            )}
          </div>
          {/* Icon rendering, only if icon is defined and valid */}
          {icon && React.isValidElement(icon) && (
            <div className={`
              relative p-4 rounded-2xl border backdrop-blur-sm
              ${colorClasses[color].icon} ${colorClasses[color].iconShadow}
              transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
            `}>
              <div className="relative z-10 w-6 h-6 flex items-center justify-center">
                {icon}
              </div>
              {/* Subtle inner glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorClasses[color].accent} opacity-5`}></div>
            </div>
          )}
        </div>
        
        {/* Enhanced trend indicator */}
        {trend && trendValue && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`
                  flex items-center space-x-1.5 px-3 py-1.5 rounded-full border
                  ${trendColors[trend]} transition-all duration-200 hover:scale-105
                `}>
                  <span className="flex items-center">
                    {trendIcons[trend]}
                  </span>
                  <span className="text-sm font-semibold">
                    {trendValue}
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  vs previous period
                </span>
              </div>
              {/* Trend sparkline placeholder */}
              <div className="hidden sm:flex items-center space-x-1">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      trend === 'up' 
                        ? 'bg-emerald-200 hover:bg-emerald-300' 
                        : trend === 'down'
                        ? 'bg-red-200 hover:bg-red-300'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    style={{ 
                      height: `${Math.random() * 16 + 8}px`,
                      animationDelay: `${i * 100}ms`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
      </div>
    </div>
  );
};

// Enhanced usage example with multiple variants
export const SummaryCardDemo: React.FC = () => {
  const iconSvg = (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Enhanced Summary Cards
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SummaryCard
            title="Total Revenue"
            value="$2.4M"
            subtitle="Annual target achieved"
            trend="up"
            trendValue="+12.5%"
            icon={iconSvg}
            color="primary"
            variant="default"
          />
          
          <SummaryCard
            title="Carbon Footprint"
            value="1,247"
            subtitle="tonnes CO2e reduced"
            trend="down"
            trendValue="-8.2%"
            icon={iconSvg}
            color="success"
            variant="gradient"
          />
          
          <SummaryCard
            title="Energy Usage"
            value="89.2%"
            subtitle="efficiency improvement"
            trend="neutral"
            trendValue="±0.1%"
            icon={iconSvg}
            color="warning"
            variant="elevated"
          />
          
          <SummaryCard
            title="Risk Assessment"
            value="2.1"
            subtitle="critical vulnerabilities"
            trend="down"
            trendValue="-45%"
            icon={iconSvg}
            color="danger"
            variant="gradient"
          />
          
          <SummaryCard
            title="Stakeholder Engagement"
            value="94.8%"
            subtitle="satisfaction score"
            trend="up"
            trendValue="+6.3%"
            icon={iconSvg}
            color="success"
            variant="elevated"
          />
          
          <SummaryCard
            title="Data Quality"
            value="99.7%"
            subtitle="audit-ready metrics"
            trend="up"
            trendValue="+2.1%"
            icon={iconSvg}
            color="primary"
            variant="default"
          />
        </div>
      </div>
    </div>
  );
};