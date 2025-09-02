import React from 'react';
import { Input } from '@/components/ui/Input';

interface GovernanceSectionProps {
  values: {
    independentBoardMembersPercent?: number;
    hasDataPrivacyPolicy?: boolean;
    totalRevenue?: number;
  };
  onChange: (field: string, value: number | boolean | undefined) => void;
  errors?: Record<string, string>;
}

export const GovernanceSection: React.FC<GovernanceSectionProps> = ({
  values,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Governance Metrics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="% of Independent Board Members"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={values.independentBoardMembersPercent || ''}
          onChange={(e) => onChange('independentBoardMembersPercent', e.target.value ? Number(e.target.value) : undefined)}
          error={errors?.independentBoardMembersPercent}
          placeholder="Enter percentage (0-100)"
          helperText="Percentage of board members who are independent"
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Does the company have a data privacy policy?
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="hasDataPrivacyPolicy"
                value="true"
                checked={values.hasDataPrivacyPolicy === true}
                onChange={(e) => onChange('hasDataPrivacyPolicy', e.target.value === 'true')}
                className="mr-2 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="hasDataPrivacyPolicy"
                value="false"
                checked={values.hasDataPrivacyPolicy === false}
                onChange={(e) => onChange('hasDataPrivacyPolicy', e.target.value === 'true')}
                className="mr-2 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              No
            </label>
          </div>
          {errors?.hasDataPrivacyPolicy && (
            <p className="text-sm text-error-600">{errors.hasDataPrivacyPolicy}</p>
          )}
        </div>
        
        <Input
          label="Total Revenue (INR)"
          type="number"
          min="0"
          step="0.01"
          value={values.totalRevenue || ''}
          onChange={(e) => onChange('totalRevenue', e.target.value ? Number(e.target.value) : undefined)}
          error={errors?.totalRevenue}
          placeholder="Enter revenue in INR"
          helperText="Required for calculating ratios"
        />
      </div>
    </div>
  );
};
