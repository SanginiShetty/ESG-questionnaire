import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface YearSelectorProps {
  selectedYear: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
  onAddNewYear: () => void;
  canAddNewYear?: boolean;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  availableYears,
  onYearChange,
  onAddNewYear,
  canAddNewYear = true
}) => {
  const currentYearIndex = availableYears.indexOf(selectedYear);
  const hasPreviousYear = currentYearIndex > 0;
  const hasNextYear = currentYearIndex < availableYears.length - 1;

  const goToPreviousYear = () => {
    if (hasPreviousYear) {
      onYearChange(availableYears[currentYearIndex - 1]);
    }
  };

  const goToNextYear = () => {
    if (hasNextYear) {
      onYearChange(availableYears[currentYearIndex + 1]);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousYear}
          disabled={!hasPreviousYear}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Financial Year {selectedYear}</h3>
          <p className="text-sm text-gray-500">
            {availableYears.length} year{availableYears.length !== 1 ? 's' : ''} available
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextYear}
          disabled={!hasNextYear}
          className="flex items-center space-x-2"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      {canAddNewYear && (
        <Button
          variant="primary"
          size="sm"
          onClick={onAddNewYear}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Year</span>
        </Button>
      )}
    </div>
  );
};
