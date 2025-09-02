// import React from 'react';

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   error?: string;
//   helperText?: string;
// }

// export const Input: React.FC<InputProps> = ({
//   label,
//   error,
//   helperText,
//   className = '',
//   id,
//   ...props
// }) => {
//   const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
//   return (
//     <div className="w-full">
//       {label && (
//         <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
//           {label}
//         </label>
//       )}
//       <input
//         id={inputId}
//         className={`
//           w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
//           ${error ? 'border-error-500' : 'border-gray-300'}
//           ${className}
//         `}
//         {...props}
//       />
//       {error && (
//         <p className="mt-1 text-sm text-error-600">{error}</p>
//       )}
//       {helperText && !error && (
//         <p className="mt-1 text-sm text-gray-500">{helperText}</p>
//       )}
//     </div>
//   );
// };

import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  success?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  icon,
  showPasswordToggle = false,
  success = false,
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  const getInputClasses = () => {
    let classes = `
      w-full px-4 py-3.5 border-2 rounded-lg bg-white
      transition-all duration-200 ease-out
      focus:outline-none focus:ring-3
      placeholder:text-gray-400 text-gray-900
      font-medium
    `;

    if (error) {
      classes += ` border-red-300 focus:border-red-500 focus:ring-red-100`;
    } else if (success) {
      classes += ` border-emerald-300 focus:border-emerald-500 focus:ring-emerald-100`;
    } else {
      classes += ` border-gray-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-100`;
    }

    if (icon || showPasswordToggle) {
      classes += icon ? ` pl-12` : ` pr-12`;
    }

    return classes;
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label 
          htmlFor={inputId} 
          className={`
            block text-sm font-semibold transition-colors duration-200
            ${error ? 'text-red-600' : success ? 'text-emerald-600' : 'text-gray-700'}
          `}
        >
          {label}
        </label>
      )}
      
      <div className="relative group">
        {icon && (
          <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
            error ? 'text-red-400' : success ? 'text-emerald-500' : 'text-gray-400 group-focus-within:text-emerald-500'
          }`}>
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          type={inputType}
          className={`${getInputClasses()} ${className}`}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          {...props}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-200"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        
        {success && !showPasswordToggle && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500">
            <CheckCircle2 size={20} />
          </div>
        )}
        
        {error && !showPasswordToggle && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500">
            <AlertCircle size={20} />
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-start space-x-2 text-red-600">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};