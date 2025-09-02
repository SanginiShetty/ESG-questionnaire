'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/Button';
import { responseApi } from '@/lib/api';
import { ESGResponse } from '@/types';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, Calculator, Leaf, Users, Shield } from 'lucide-react';

export default function QuestionnairePage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState<Partial<ESGResponse>>({
    year: new Date().getFullYear(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState({
    environmental: true,
    social: true,
    governance: true,
    metrics: true
  });
  const [activeMainTab, setActiveMainTab] = useState('questionnaire');

  const handleMainTabChange = (tab: string) => {
    if (tab === 'dashboard') {
      router.push('/dashboard');
    } else if (tab === 'summary') {
      router.push('/summary');
    } else {
      setActiveMainTab(tab);
    }
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, year }));
  }, [year]);

  const handleFieldChange = (field: string, value: number | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate metrics in real-time
  const calculateCarbonIntensity = () => {
    if (formData.carbonEmissions && formData.totalRevenue && formData.totalRevenue > 0) {
      return (formData.carbonEmissions / formData.totalRevenue).toFixed(4);
    }
    return 'N/A';
  };

  const calculateRenewableRatio = () => {
    if (formData.renewableElectricityConsumption && formData.totalElectricityConsumption && formData.totalElectricityConsumption > 0) {
      return ((formData.renewableElectricityConsumption / formData.totalElectricityConsumption) * 100).toFixed(2);
    }
    return 'N/A';
  };

  const calculateDiversityRatio = () => {
    if (formData.femaleEmployees && formData.totalEmployees && formData.totalEmployees > 0) {
      return ((formData.femaleEmployees / formData.totalEmployees) * 100).toFixed(2);
    }
    return 'N/A';
  };

  const calculateCommunitySpendRatio = () => {
    if (formData.communityInvestmentSpend && formData.totalRevenue && formData.totalRevenue > 0) {
      return ((formData.communityInvestmentSpend / formData.totalRevenue) * 100).toFixed(2);
    }
    return 'N/A';
  };

  // Validation logic
  const validate = () => {
    const newErrors: Record<string, string> = {};
    // Environmental
    if (formData.totalElectricityConsumption == null || formData.totalElectricityConsumption < 0) {
      newErrors.totalElectricityConsumption = 'Required and must be >= 0';
    }
    if (formData.renewableElectricityConsumption == null || formData.renewableElectricityConsumption < 0) {
      newErrors.renewableElectricityConsumption = 'Required and must be >= 0';
    }
    if (formData.totalFuelConsumption == null || formData.totalFuelConsumption < 0) {
      newErrors.totalFuelConsumption = 'Required and must be >= 0';
    }
    if (formData.carbonEmissions == null || formData.carbonEmissions < 0) {
      newErrors.carbonEmissions = 'Required and must be >= 0';
    }
    // Social
    if (formData.totalEmployees == null || formData.totalEmployees < 0) {
      newErrors.totalEmployees = 'Required and must be >= 0';
    }
    if (formData.femaleEmployees == null || formData.femaleEmployees < 0 || (formData.femaleEmployees ?? 0) > (formData.totalEmployees ?? 0)) {
      newErrors.femaleEmployees = 'Required, must be >= 0, and <= total employees';
    }
    if (formData.averageTrainingHours == null || formData.averageTrainingHours < 0) {
      newErrors.averageTrainingHours = 'Required and must be >= 0';
    }
    if (formData.communityInvestmentSpend == null || formData.communityInvestmentSpend < 0) {
      newErrors.communityInvestmentSpend = 'Required and must be >= 0';
    }
    // Governance
    if (formData.independentBoardMembersPercent == null || formData.independentBoardMembersPercent < 0 || formData.independentBoardMembersPercent > 100) {
      newErrors.independentBoardMembersPercent = 'Required, must be between 0 and 100';
    }
    if (formData.hasDataPrivacyPolicy == null) {
      newErrors.hasDataPrivacyPolicy = 'Required';
    }
    if (formData.totalRevenue == null || formData.totalRevenue <= 0) {
      newErrors.totalRevenue = 'Required and must be > 0';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!year) {
      alert('Please select a financial year');
      return;
    }
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      alert('Please fix validation errors');
      return;
    }
    try {
      setSaving(true);
      await responseApi.save({ ...formData, year });
      alert('ESG data saved successfully!');
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Failed to save response:', error);
      alert('Failed to save ESG data');
    } finally {
      setSaving(false);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setYear(newYear);
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeTab={activeMainTab} onTabChange={handleMainTabChange} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ESG Questionnaire</h1>
                <p className="text-gray-600 mt-1">Complete your Environmental, Social & Governance data</p>
              </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-gradient-to-br from-green-200 via-green-300 to-green-600 rounded-2xl shadow-2xl p-1">
                <div className="bg-white rounded-xl p-8">
                  <div className="text-center mb-8">
                    <div className="flex justify-center items-center mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 rounded-full shadow-lg">
                        <div className="flex space-x-2">
                          <Leaf className="w-8 h-8 text-white" />
                          <Users className="w-8 h-8 text-white" />
                          <Shield className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-green-800 to-green-900 bg-clip-text text-transparent mb-3">
                      Data Entry Form
                    </h2>
                    <p className="text-lg text-black font-medium">Enter your ESG metrics for comprehensive analysis</p>
                    <div className="mt-4 flex justify-center">
                      <div className="flex items-center space-x-6 text-sm text-black">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Environmental</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>Social</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span>Governance</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Entry Guide */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 Data Entry Guide</h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li>• Fill in all required fields for the selected financial year</li>
                      <li>• Real-time calculations will appear as you enter data</li>
                      <li>• Use consistent units: kWh for electricity, liters for fuel, INR for currency</li>
                      <li>• Ensure female employees ≤ total employees</li>
                    </ul>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Year Selection */}
                    <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                      <label htmlFor="year" className="block text-lg font-semibold text-gray-900 mb-3">
                        📅 Financial Year
                      </label>
                      <select
                        id="year"
                        value={year}
                        onChange={handleYearChange}
                        className="block w-full px-4 py-3 text-lg text-black border-2 border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        {Array.from({ length: 10 }, (_, i) => {
                          const yearOption = new Date().getFullYear() - i;
                          return (
                            <option key={yearOption} value={yearOption}>
                              {yearOption}
                            </option>
                          );
                        })}
                      </select>
                    </div>

              {/* Environmental Section */}
              <div className="bg-white rounded-lg border-2 border-green-200 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('environmental')}
                  className="w-full px-6 py-4 bg-green-50 border-b border-green-200 flex items-center justify-between hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Leaf className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-bold text-green-800">🌱 Environmental Metrics</h3>
                  </div>
                  {expandedSections.environmental ? 
                    <ChevronUp className="w-5 h-5 text-green-600" /> : 
                    <ChevronDown className="w-5 h-5 text-green-600" />
                  }
                </button>
                
                {expandedSections.environmental && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Total Electricity Consumption (kWh)
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          value={formData.totalElectricityConsumption ?? ''}
                          onChange={e => handleFieldChange('totalElectricityConsumption', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-4 py-3 text-base text-black border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter electricity consumption"
                        />
                        {errors.totalElectricityConsumption && 
                          <p className="text-sm text-red-600 mt-1 font-medium">{errors.totalElectricityConsumption}</p>
                        }
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Renewable Electricity Consumption (kWh)
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          value={formData.renewableElectricityConsumption ?? ''}
                          onChange={e => handleFieldChange('renewableElectricityConsumption', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-4 py-3 text-base text-black border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter renewable electricity"
                        />
                        {errors.renewableElectricityConsumption && 
                          <p className="text-sm text-red-600 mt-1 font-medium">{errors.renewableElectricityConsumption}</p>
                        }
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Total Fuel Consumption (liters)
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          value={formData.totalFuelConsumption ?? ''}
                          onChange={e => handleFieldChange('totalFuelConsumption', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-4 py-3 text-base text-black border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter fuel consumption"
                        />
                        {errors.totalFuelConsumption && 
                          <p className="text-sm text-red-600 mt-1 font-medium">{errors.totalFuelConsumption}</p>
                        }
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Carbon Emissions (T CO2e)
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          value={formData.carbonEmissions ?? ''}
                          onChange={e => handleFieldChange('carbonEmissions', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-4 py-3 text-base text-black border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter carbon emissions"
                        />
                        {errors.carbonEmissions && 
                          <p className="text-sm text-red-600 mt-1 font-medium">{errors.carbonEmissions}</p>
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Section */}
              <div className="bg-white rounded-lg border-2 border-blue-200 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('social')}
                  className="w-full px-6 py-4 bg-blue-50 border-b border-blue-200 flex items-center justify-between hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-blue-800">👥 Social Metrics</h3>
                  </div>
                  {expandedSections.social ? 
                    <ChevronUp className="w-5 h-5 text-blue-600" /> : 
                    <ChevronDown className="w-5 h-5 text-blue-600" />
                  }
                </button>
                
                {expandedSections.social && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Total Employees
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          step="1" 
                          value={formData.totalEmployees ?? ''}
                          onChange={e => handleFieldChange('totalEmployees', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-4 py-3 text-base text-black border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter total employees"
                        />
                        {errors.totalEmployees && 
                          <p className="text-sm text-red-600 mt-1 font-medium">{errors.totalEmployees}</p>
                        }
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Female Employees
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          step="1" 
                          value={formData.femaleEmployees ?? ''}
                          onChange={e => handleFieldChange('femaleEmployees', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-4 py-3 text-base text-black border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter female employees"
                        />
                        {errors.femaleEmployees && 
                          <p className="text-sm text-red-600 mt-1 font-medium">{errors.femaleEmployees}</p>
                        }
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Average Training Hours (per year)
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          step="0.1" 
                          value={formData.averageTrainingHours ?? ''}
                          onChange={e => handleFieldChange('averageTrainingHours', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-4 py-3 text-base text-black border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter training hours"
                        />
                        {errors.averageTrainingHours && 
                          <p className="text-sm text-red-600 mt-1 font-medium">{errors.averageTrainingHours}</p>
                        }
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Community Investment Spend (INR)
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          value={formData.communityInvestmentSpend ?? ''}
                          onChange={e => handleFieldChange('communityInvestmentSpend', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-4 py-3 text-base text-black border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter community spend"
                        />
                        {errors.communityInvestmentSpend && 
                          <p className="text-sm text-red-600 mt-1 font-medium">{errors.communityInvestmentSpend}</p>
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Governance Section */}
              <div className="bg-white rounded-lg border-2 border-purple-200 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('governance')}
                  className="w-full px-6 py-4 bg-purple-50 border-b border-purple-200 flex items-center justify-between hover:bg-purple-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-purple-800">🛡️ Governance Metrics</h3>
                  </div>
                  {expandedSections.governance ? 
                    <ChevronUp className="w-5 h-5 text-purple-600" /> : 
                    <ChevronDown className="w-5 h-5 text-purple-600" />
                  }
                </button>
                
                {expandedSections.governance && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          % Independent Board Members
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          step="0.1" 
                          value={formData.independentBoardMembersPercent ?? ''}
                          onChange={e => handleFieldChange('independentBoardMembersPercent', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-4 py-3 text-base text-black border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Enter percentage (0-100)"
                        />
                        {errors.independentBoardMembersPercent && 
                          <p className="text-sm text-red-600 mt-1 font-medium">{errors.independentBoardMembersPercent}</p>
                        }
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Data Privacy Policy
                        </label>
                          <select 
                            value={formData.hasDataPrivacyPolicy === true ? 'true' : formData.hasDataPrivacyPolicy === false ? 'false' : ''}
                            onChange={e => handleFieldChange('hasDataPrivacyPolicy', e.target.value === 'true')}
                            className="w-full px-4 py-3 text-base text-black border-2 border-gray-300 rounded-lg 
                                      focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="" className="text-gray-600">Select an option</option>
                          <option value="true" className="text-gray-600">Yes</option>
                          <option value="false" className="text-gray-600">No</option>
                        </select>
                        {errors.hasDataPrivacyPolicy && 
                          <p className="text-sm text-red-600 mt-1 font-medium">{errors.hasDataPrivacyPolicy}</p>
                        }
                      </div>


                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Total Revenue (INR)
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          value={formData.totalRevenue ?? ''}
                          onChange={e => handleFieldChange('totalRevenue', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-4 py-3 text-base text-black border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Enter total revenue"
                        />
                        {errors.totalRevenue && 
                          <p className="text-sm text-red-600 mt-1 font-medium">{errors.totalRevenue}</p>
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Real-time Calculated Metrics */}
              <div className="bg-white rounded-lg border-2 border-yellow-200 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('metrics')}
                  className="w-full px-6 py-4 bg-yellow-50 border-b border-yellow-200 flex items-center justify-between hover:bg-yellow-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Calculator className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-xl font-bold text-yellow-800">📊 Auto-Calculated Metrics</h3>
                  </div>
                  {expandedSections.metrics ? 
                    <ChevronUp className="w-5 h-5 text-yellow-600" /> : 
                    <ChevronDown className="w-5 h-5 text-yellow-600" />
                  }
                </button>
                
                {expandedSections.metrics && (
                  <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-lg border-2 border-red-200 shadow-sm">
                        <h4 className="text-lg font-bold text-red-700 mb-2">Carbon Intensity</h4>
                        <p className="text-xs text-gray-600 mb-3">Formula: Carbon Emissions ÷ Total Revenue</p>
                        <p className="text-3xl font-bold text-red-600">{calculateCarbonIntensity()}</p>
                        <p className="text-sm text-gray-700 font-medium">T CO2e / INR</p>
                      </div>

                      <div className="bg-white p-6 rounded-lg border-2 border-green-200 shadow-sm">
                        <h4 className="text-lg font-bold text-green-700 mb-2">Renewable Electricity Ratio</h4>
                        <p className="text-xs text-gray-600 mb-3">Formula: (Renewable ÷ Total Electricity) × 100%</p>
                        <p className="text-3xl font-bold text-green-600">{calculateRenewableRatio()}%</p>
                        <p className="text-sm text-gray-700 font-medium">% of total electricity</p>
                      </div>

                      <div className="bg-white p-6 rounded-lg border-2 border-blue-200 shadow-sm">
                        <h4 className="text-lg font-bold text-blue-700 mb-2">Diversity Ratio</h4>
                        <p className="text-xs text-gray-600 mb-3">Formula: (Female Employees ÷ Total Employees) × 100%</p>
                        <p className="text-3xl font-bold text-blue-600">{calculateDiversityRatio()}%</p>
                        <p className="text-sm text-gray-700 font-medium">% female employees</p>
                      </div>

                      <div className="bg-white p-6 rounded-lg border-2 border-purple-200 shadow-sm">
                        <h4 className="text-lg font-bold text-purple-700 mb-2">Community Spend Ratio</h4>
                        <p className="text-xs text-gray-600 mb-3">Formula: (Community Investment ÷ Total Revenue) × 100%</p>
                        <p className="text-3xl font-bold text-purple-600">{calculateCommunitySpendRatio()}%</p>
                        <p className="text-sm text-gray-700 font-medium">% of total revenue</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium">
                        💡 These metrics are calculated automatically based on your inputs above
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        All ratios require both numerator and denominator values to be entered
                      </p>
                    </div>
                  </div>
                )}
              </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/dashboard')}
                        className="px-8 py-3 text-lg font-semibold"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        loading={saving}
                        disabled={saving}
                        className="px-8 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                      >
                        {saving ? 'Saving...' : 'Save ESG Data'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
