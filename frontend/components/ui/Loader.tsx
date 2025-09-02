// import React from 'react';

// interface LoaderProps {
//   size?: 'sm' | 'md' | 'lg';
//   className?: string;
// }

// export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
//   const sizeClasses = {
//     sm: 'w-4 h-4',
//     md: 'w-6 h-6',
//     lg: 'w-8 h-8'
//   };

//   return (
//     <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${sizeClasses[size]} ${className}`} />
//   );
// };

import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'default' | 'emerald' | 'white' | 'gray';
  type?: 'spinner' | 'dots' | 'pulse';
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  className = '',
  variant = 'default',
  type = 'spinner'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const variantClasses = {
    default: 'border-gray-300 border-t-emerald-600',
    emerald: 'border-emerald-200 border-t-emerald-600',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-200 border-t-gray-600'
  };

  // Spinner loader (original style)
  if (type === 'spinner') {
    return (
      <div 
        className={`
          animate-spin rounded-full border-2 
          ${variantClasses[variant]} 
          ${sizeClasses[size]} 
          ${className}
        `} 
      />
    );
  }

  // Dots loader
  if (type === 'dots') {
    const dotSizes = {
      sm: 'w-1 h-1',
      md: 'w-1.5 h-1.5',
      lg: 'w-2 h-2',
      xl: 'w-2.5 h-2.5'
    };

    const dotColors = {
      default: 'bg-emerald-600',
      emerald: 'bg-emerald-600',
      white: 'bg-white',
      gray: 'bg-gray-600'
    };

    return (
      <div className={`flex space-x-1 ${className}`}>
        <div className={`${dotSizes[size]} ${dotColors[variant]} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
        <div className={`${dotSizes[size]} ${dotColors[variant]} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
        <div className={`${dotSizes[size]} ${dotColors[variant]} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
      </div>
    );
  }

  // Pulse loader
  if (type === 'pulse') {
    const pulseColors = {
      default: 'bg-emerald-600',
      emerald: 'bg-emerald-600',
      white: 'bg-white',
      gray: 'bg-gray-600'
    };

    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <div className={`w-full h-full ${pulseColors[variant]} rounded-full animate-pulse`}></div>
      </div>
    );
  }

  return null;
};