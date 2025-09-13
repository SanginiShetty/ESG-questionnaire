'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/Button';
import { responseApi } from '@/lib/api';
import { ESGResponse } from '@/types';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, Calculator, Leaf, Users, Shield } from 'lucide-react';
import { FileUpload } from '@/components/questionnaire/FileUpload';

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

  const handleFileUploadSuccess = (data: ESGResponse) => {
    // Merge the uploaded data with current form data
    setFormData(prev => ({
      ...prev,
      ...data
    }));
    alert('File data extracted and merged successfully!');
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

            <div className="max-w-6xl mx-auto space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <div className="flex justify-center items-center mb-6">
                    <div className="bg-slate-100 p-4 rounded-lg">
                      <div className="flex space-x-3">
                        <Leaf className="w-6 h-6 text-emerald-600" />
                        <Users className="w-6 h-6 text-blue-600" />
                        <Shield className="w-6 h-6 text-slate-600" />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    ESG Data Collection Form
                  </h2>
                  <p className="text-gray-600">Enter your Environmental, Social & Governance metrics for the selected financial year</p>
                  <div className="mt-6 flex justify-center">
                    <div className="flex items-center space-x-8 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span>Environmental</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Social</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                        <span>Governance</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Entry Guide */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-medium text-slate-900 mb-3 flex items-center">
                    <span className="mr-2">📋</span>
                    Data Entry Guidelines
                  </h3>
                  <ul className="text-sm text-slate-700 space-y-2 leading-relaxed">
                    <li>• Complete all required fields for the selected financial year</li>
                    <li>• Calculations will update automatically as you enter data</li>
                    <li>• Use consistent units: kWh for electricity, liters for fuel, INR for currency</li>
                    <li>• Ensure female employees count does not exceed total employees</li>
                    <li>• Upload PDF/Excel files to auto-populate the form with extracted data</li>
                  </ul>
                </div>

                <FileUpload year={year || new Date().getFullYear()} onUploadSuccess={handleFileUploadSuccess} />

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Year Selection */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <label htmlFor="year" className="block text-base font-medium text-gray-900 mb-3">
                      Financial Year
                    </label>
                    <select
                      id="year"
                      value={year}
                      onChange={handleYearChange}
                      className="block w-full max-w-xs px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleSection('environmental')}
                      className="w-full px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between hover:bg-emerald-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Leaf className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-lg font-medium text-emerald-900">Environmental Metrics</h3>
                      </div>
                      {expandedSections.environmental ? 
                        <ChevronUp className="w-5 h-5 text-emerald-600" /> : 
                        <ChevronDown className="w-5 h-5 text-emerald-600" />
                      }
                    </button>
                    
                    {expandedSections.environmental && (
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Total Electricity Consumption (kWh) *
                            </label>
                            <input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              value={formData.totalElectricityConsumption ?? ''}
                              onChange={e => handleFieldChange('totalElectricityConsumption', e.target.value ? Number(e.target.value) : undefined)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white"
                              placeholder="0.00"
                            />
                            {errors.totalElectricityConsumption && 
                              <p className="text-sm text-red-600 mt-1">{errors.totalElectricityConsumption}</p>
                            }
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Renewable Electricity Consumption (kWh) *
                            </label>
                            <input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              value={formData.renewableElectricityConsumption ?? ''}
                              onChange={e => handleFieldChange('renewableElectricityConsumption', e.target.value ? Number(e.target.value) : undefined)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white"
                              placeholder="0.00"
                            />
                            {errors.renewableElectricityConsumption && 
                              <p className="text-sm text-red-600 mt-1">{errors.renewableElectricityConsumption}</p>
                            }
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Total Fuel Consumption (liters) *
                            </label>
                            <input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              value={formData.totalFuelConsumption ?? ''}
                              onChange={e => handleFieldChange('totalFuelConsumption', e.target.value ? Number(e.target.value) : undefined)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white"
                              placeholder="0.00"
                            />
                            {errors.totalFuelConsumption && 
                              <p className="text-sm text-red-600 mt-1">{errors.totalFuelConsumption}</p>
                            }
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Carbon Emissions (T CO2e) *
                            </label>
                            <input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              value={formData.carbonEmissions ?? ''}
                              onChange={e => handleFieldChange('carbonEmissions', e.target.value ? Number(e.target.value) : undefined)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white"
                              placeholder="0.00"
                            />
                            {errors.carbonEmissions && 
                              <p className="text-sm text-red-600 mt-1">{errors.carbonEmissions}</p>
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

              {/* Social Section */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('social')}
                  className="w-full px-6 py-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-medium text-blue-900">Social Metrics</h3>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Employees *
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          step="1" 
                          value={formData.totalEmployees ?? ''}
                          onChange={e => handleFieldChange('totalEmployees', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          placeholder="0"
                        />
                        {errors.totalEmployees && 
                          <p className="text-sm text-red-600 mt-1">{errors.totalEmployees}</p>
                        }
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Female Employees *
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          step="1" 
                          value={formData.femaleEmployees ?? ''}
                          onChange={e => handleFieldChange('femaleEmployees', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          placeholder="0"
                        />
                        {errors.femaleEmployees && 
                          <p className="text-sm text-red-600 mt-1">{errors.femaleEmployees}</p>
                        }
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Average Training Hours (per year) *
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          step="0.1" 
                          value={formData.averageTrainingHours ?? ''}
                          onChange={e => handleFieldChange('averageTrainingHours', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          placeholder="0.0"
                        />
                        {errors.averageTrainingHours && 
                          <p className="text-sm text-red-600 mt-1">{errors.averageTrainingHours}</p>
                        }
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Community Investment Spend (INR) *
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          value={formData.communityInvestmentSpend ?? ''}
                          onChange={e => handleFieldChange('communityInvestmentSpend', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          placeholder="0.00"
                        />
                        {errors.communityInvestmentSpend && 
                          <p className="text-sm text-red-600 mt-1">{errors.communityInvestmentSpend}</p>
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Governance Section */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('governance')}
                  className="w-full px-6 py-4 bg-purple-50 border-b border-purple-100 flex items-center justify-between hover:bg-purple-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-medium text-purple-900">Governance Metrics</h3>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          % Independent Board Members *
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          step="0.1" 
                          value={formData.independentBoardMembersPercent ?? ''}
                          onChange={e => handleFieldChange('independentBoardMembersPercent', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                          placeholder="0.0"
                        />
                        {errors.independentBoardMembersPercent && 
                          <p className="text-sm text-red-600 mt-1">{errors.independentBoardMembersPercent}</p>
                        }
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data Privacy Policy *
                        </label>
                          <select 
                            value={formData.hasDataPrivacyPolicy === true ? 'true' : formData.hasDataPrivacyPolicy === false ? 'false' : ''}
                            onChange={e => handleFieldChange('hasDataPrivacyPolicy', e.target.value === 'true')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                        >
                          <option value="">Select an option</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                        {errors.hasDataPrivacyPolicy && 
                          <p className="text-sm text-red-600 mt-1">{errors.hasDataPrivacyPolicy}</p>
                        }
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Revenue (INR) *
                        </label>
                        <input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          value={formData.totalRevenue ?? ''}
                          onChange={e => handleFieldChange('totalRevenue', e.target.value ? Number(e.target.value) : undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                          placeholder="0.00"
                        />
                        {errors.totalRevenue && 
                          <p className="text-sm text-red-600 mt-1">{errors.totalRevenue}</p>
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Real-time Calculated Metrics */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection('metrics')}
                  className="w-full px-6 py-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between hover:bg-amber-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Calculator className="w-5 h-5 text-amber-600" />
                    <h3 className="text-lg font-medium text-amber-900">Calculated Metrics</h3>
                  </div>
                  {expandedSections.metrics ? 
                    <ChevronUp className="w-5 h-5 text-amber-600" /> : 
                    <ChevronDown className="w-5 h-5 text-amber-600" />
                  }
                </button>
                
                {expandedSections.metrics && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-1">Renewable Energy %</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          {formData.totalElectricityConsumption && formData.renewableElectricityConsumption 
                            ? Math.round((formData.renewableElectricityConsumption / formData.totalElectricityConsumption) * 100) 
                            : 0}%
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-1">Female Workforce %</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formData.totalEmployees && formData.femaleEmployees 
                            ? Math.round((formData.femaleEmployees / formData.totalEmployees) * 100) 
                            : 0}%
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-1">Carbon Intensity</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {formData.carbonEmissions && formData.totalRevenue 
                            ? (formData.carbonEmissions / (formData.totalRevenue / 1000000)).toFixed(2) 
                            : 0}
                        </p>
                        <p className="text-xs text-gray-500">T CO2e/M INR</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* File Upload Section */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Document Upload</h3>
                  <p className="text-sm text-gray-600 mt-1">Upload ESG reports for AI-powered data extraction (PDF or Excel)</p>
                </div>
                <div className="p-6">
                  <FileUpload year={year || new Date().getFullYear()} onUploadSuccess={handleFileUploadSuccess} />
                </div>
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
    </main>
  </div>
</ProtectedRoute>
);
}
