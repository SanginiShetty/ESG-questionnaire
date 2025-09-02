'use client';

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { ESGResponse, SummaryData } from '@/types';
import { exportToPDF, exportToExcel } from '@/lib/exportUtils';
import { useAuth } from '@/hooks/useAuth';

interface ExportButtonsProps {
  responses: ESGResponse[];
  summary?: SummaryData;
  className?: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ 
  responses, 
  summary, 
  className = '' 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuth();

  const handleExportPDF = async () => {
    if (!summary) {
      console.error('Summary data not available for export');
      return;
    }

    try {
      setIsExporting(true);
      exportToPDF(responses, summary, user?.name || 'User');
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    if (!summary) {
      console.error('Summary data not available for export');
      return;
    }

    try {
      setIsExporting(true);
      exportToExcel(responses, summary, user?.name || 'User');
    } catch (error) {
      console.error('Failed to export Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-sm text-gray-600 font-medium">Export:</span>
      
      <button
        onClick={handleExportPDF}
        disabled={isExporting || !summary}
        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FileText className="w-4 h-4" />
        <span>PDF</span>
      </button>
      
      <button
        onClick={handleExportExcel}
        disabled={isExporting || !summary}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span>Excel</span>
      </button>
      
      {isExporting && (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Download className="w-4 h-4 animate-bounce" />
          <span>Exporting...</span>
        </div>
      )}
    </div>
  );
};
