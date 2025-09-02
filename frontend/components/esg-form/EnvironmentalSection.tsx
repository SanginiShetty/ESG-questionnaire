import React from 'react';
import { Input } from '@/components/ui/Input';

interface EnvironmentalSectionProps {
  values: {
    totalElectricityConsumption?: number;
    renewableElectricityConsumption?: number;
    totalFuelConsumption?: number;
    carbonEmissions?: number;
  };
  onChange: (field: string, value: number | undefined) => void;
  errors?: Record<string, string>;
}

export const EnvironmentalSection: React.FC<EnvironmentalSectionProps> = ({
  values,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Environmental Metrics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Total Electricity Consumption (kWh)"
          type="number"
          min="0"
          step="0.01"
          value={values.totalElectricityConsumption || ''}
          onChange={(e) => onChange('totalElectricityConsumption', e.target.value ? Number(e.target.value) : undefined)}
          error={errors?.totalElectricityConsumption}
          placeholder="Enter value in kWh"
        />
        
        <Input
          label="Renewable Electricity Consumption (kWh)"
          type="number"
          min="0"
          step="0.01"
          value={values.renewableElectricityConsumption || ''}
          onChange={(e) => onChange('renewableElectricityConsumption', e.target.value ? Number(e.target.value) : undefined)}
          error={errors?.renewableElectricityConsumption}
          placeholder="Enter value in kWh"
        />
        
        <Input
          label="Total Fuel Consumption (liters)"
          type="number"
          min="0"
          step="0.01"
          value={values.totalFuelConsumption || ''}
          onChange={(e) => onChange('totalFuelConsumption', e.target.value ? Number(e.target.value) : undefined)}
          error={errors?.totalFuelConsumption}
          placeholder="Enter value in liters"
        />
        
        <Input
          label="Carbon Emissions (T CO2e)"
          type="number"
          min="0"
          step="0.01"
          value={values.carbonEmissions || ''}
          onChange={(e) => onChange('carbonEmissions', e.target.value ? Number(e.target.value) : undefined)}
          error={errors?.carbonEmissions}
          placeholder="Enter value in T CO2e"
        />
      </div>
    </div>
  );
};