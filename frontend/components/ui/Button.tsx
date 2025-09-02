// import React from 'react';
// import { Loader } from './Loader';

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: 'primary' | 'secondary' | 'outline' | 'danger';
//   size?: 'sm' | 'md' | 'lg';
//   loading?: boolean;
//   children: React.ReactNode;
// }

// export const Button: React.FC<ButtonProps> = ({
//   variant = 'primary',
//   size = 'md',
//   loading = false,
//   children,
//   className = '',
//   disabled,
//   ...props
// }) => {
//   const baseClasses = 'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
//   const variants = {
//     primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
//     secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
//     outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
//     danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
//   };

//   const sizes = {
//     sm: 'px-3 py-1.5 text-sm',
//     md: 'px-4 py-2 text-sm',
//     lg: 'px-6 py-3 text-base',
//   };

//   const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

//   return (
//     <button className={classes} disabled={disabled || loading} {...props}>
//       {loading ? (
//         <span className="flex items-center justify-center">
//           <Loader size="sm" className="mr-2" />
//           Loading...
//         </span>
//       ) : (
//         children
//       )}
//     </button>
//   );
// };

import React from 'react';

// Loader Component
const Loader = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-current border-t-transparent"></div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = `
    relative overflow-hidden rounded-lg font-semibold transition-all duration-200 ease-out
    focus:outline-none focus:ring-3 disabled:opacity-50 disabled:cursor-not-allowed
    transform active:scale-98 hover:shadow-lg
    inline-flex items-center justify-center
  `;
  
  const variants = {
    primary: `
      bg-emerald-600 text-white 
      hover:bg-emerald-700 active:bg-emerald-800
      focus:ring-emerald-200 shadow-md shadow-emerald-500/20
    `,
    secondary: `
      bg-gray-100 text-gray-800 border border-gray-200
      hover:bg-gray-200 hover:border-gray-300
      focus:ring-gray-200 shadow-md
    `,
    outline: `
      border-2 border-emerald-600 bg-white text-emerald-600
      hover:bg-emerald-50 active:bg-emerald-100
      focus:ring-emerald-200 shadow-md
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700 active:bg-red-800
      focus:ring-red-200 shadow-md shadow-red-500/20
    `,
    success: `
      bg-green-600 text-white
      hover:bg-green-700 active:bg-green-800
      focus:ring-green-200 shadow-md shadow-green-500/20
    `,
    ghost: `
      bg-transparent text-gray-600 hover:bg-gray-100
      focus:ring-gray-200
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-2 h-9',
    md: 'px-6 py-3 text-sm gap-2 h-11',
    lg: 'px-8 py-4 text-base gap-3 h-12',
    xl: 'px-10 py-5 text-lg gap-3 h-14',
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <Loader size="sm" />
          <span>Loading...</span>
        </>
      );
    }

    const iconElement = icon && React.cloneElement(icon as React.ReactElement, {
      size: iconSizes[size]
    });

    if (icon && iconPosition === 'left') {
      return (
        <>
          {iconElement}
          <span>{children}</span>
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          <span>{children}</span>
          {iconElement}
        </>
      );
    }

    return children;
  };

  return (
    <button 
      className={classes} 
      disabled={disabled || loading} 
      {...props}
    >
      {renderContent()}
    </button>
  );
};