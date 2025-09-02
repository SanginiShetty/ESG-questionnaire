import React from 'react';
import { Input } from '@/components/ui/Input';

interface SocialSectionProps {
  values: {
    totalEmployees?: number;
    femaleEmployees?: number;
    averageTrainingHours?: number;
    communityInvestmentSpend?: number;
  };
  onChange: (field: string, value: number | undefined) => void;
  errors?: Record<string, string>;
}

export const SocialSection: React.FC<SocialSectionProps> = ({
  values,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Social Metrics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Total Number of Employees"
          type="number"
          min="0"
          step="1"
          value={values.totalEmployees || ''}
          onChange={(e) => onChange('totalEmployees', e.target.value ? Number(e.target.value) : undefined)}
          error={errors?.totalEmployees}
          placeholder="Enter total employees"
        />
        
        <Input
          label="Number of Female Employees"
          type="number"
          min="0"
          step="1"
          value={values.femaleEmployees || ''}
          onChange={(e) => onChange('femaleEmployees', e.target.value ? Number(e.target.value) : undefined)}
          error={errors?.femaleEmployees}
          placeholder="Enter female employees"
        />
        
        <Input
          label="Average Training Hours per Employee (per year)"
          type="number"
          min="0"
          step="0.1"
          value={values.averageTrainingHours || ''}
          onChange={(e) => onChange('averageTrainingHours', e.target.value ? Number(e.target.value) : undefined)}
          error={errors?.averageTrainingHours}
          placeholder="Enter training hours"
        />
        
        <Input
          label="Community Investment Spend (INR)"
          type="number"
          min="0"
          step="0.01"
          value={values.communityInvestmentSpend || ''}
          onChange={(e) => onChange('communityInvestmentSpend', e.target.value ? Number(e.target.value) : undefined)}
          error={errors?.communityInvestmentSpend}
          placeholder="Enter amount in INR"
        />
      </div>
    </div>
  );
};
