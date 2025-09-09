'use client';

import React from 'react';

interface FileUploadProps {
  year: number;
  onUploadSuccess: (data: any) => void;
}

export const FileUpload = ({ year }: FileUploadProps) => {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-black mb-4">ESG Data Entry</h3>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">File Upload Disabled</h4>
        <p className="text-sm text-yellow-700">
          File upload functionality has been temporarily disabled. 
          Please use the manual data entry form to input your ESG data for {year}.
        </p>
      </div>

      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">
          Use the manual form below to enter your sustainability metrics
        </p>
      </div>
    </div>
  );
};
