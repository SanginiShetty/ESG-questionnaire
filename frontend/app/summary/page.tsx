'use client';
 
import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ExportButtons } from '@/components/dashboard/ExportButtons';
import { responseApi, summaryApi } from '@/lib/api';
import { ESGResponse, SummaryData } from '@/types';
import { Loader } from '@/components/ui/Loader';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Users, 
  Globe, 
  Shield,
  BarChart3,
  Activity,
  Edit,
  Save,
  X,
  Check
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

// Removed unused COLORS constant

export default function SummaryPage() {
  const router = useRouter();
  const [responses, setResponses] = useState<ESGResponse[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMainTab, setActiveMainTab] = useState('summary');
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [editingYear, setEditingYear] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ESGResponse>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [responsesData, summaryData] = await Promise.all([
        responseApi.getAll(),
        summaryApi.getSummary()
      ]);
      
      setResponses(responsesData.responses);
      setSummary(summaryData.summary);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMainTabChange = (tab: string) => {
    if (tab === 'questionnaire') {
      router.push('/questionnaire');
    } else if (tab === 'dashboard') {
      router.push('/dashboard');
    } else {
      setActiveMainTab(tab);
    }
  };

  const startEditing = (response: ESGResponse) => {
    setEditingYear(response.year);
    setEditFormData({
      totalElectricityConsumption: response.totalElectricityConsumption,
      renewableElectricityConsumption: response.renewableElectricityConsumption,
      totalFuelConsumption: response.totalFuelConsumption,
      carbonEmissions: response.carbonEmissions,
      totalEmployees: response.totalEmployees,
      femaleEmployees: response.femaleEmployees,
      averageTrainingHours: response.averageTrainingHours,
      communityInvestmentSpend: response.communityInvestmentSpend,
      independentBoardMembersPercent: response.independentBoardMembersPercent,
      hasDataPrivacyPolicy: response.hasDataPrivacyPolicy,
      totalRevenue: response.totalRevenue,
    });
  };

  const cancelEditing = () => {
    setEditingYear(null);
    setEditFormData({});
  };

  const saveChanges = async () => {
    if (!editingYear) return;

    try {
      setSaving(true);
      await responseApi.update(editingYear, editFormData);
      
      // Refresh data
      await loadData();
      
      setEditingYear(null);
      setEditFormData({});
      
      // Show success message
      alert('Data updated successfully!');
    } catch (error) {
      console.error('Failed to update data:', error);
      alert('Failed to update data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ESGResponse, value: string) => {
    const numericValue = value === '' ? null : parseFloat(value);
    setEditFormData(prev => ({
      ...prev,
      [field]: isNaN(numericValue as number) ? null : numericValue
    }));
  };

  const handleBooleanChange = (field: keyof ESGResponse, value: boolean) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Prepare chart data
  const barChartData = responses.map(response => ({
    year: response.year,
    carbonIntensity: parseFloat(response.carbonIntensity?.toString() || '0'),
    diversityRatio: parseFloat(response.diversityRatio?.toString() || '0'),
    renewableRatio: parseFloat(response.renewableElectricityRatio?.toString() || '0'),
    independentBoard: parseFloat(response.independentBoardMembersPercent?.toString() || '0')
  }));

  const trendData = responses.map(response => ({
    year: response.year,
    emissions: response.carbonEmissions || 0,
    employees: response.totalEmployees || 0,
    revenue: response.totalRevenue || 0
  }));

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Records"
          value={summary?.totalRecords?.toString() || '0'}
          subtitle="ESG responses"
        />
        
        <MetricCard
          title="Years Covered"
          value={summary?.years?.length?.toString() || '0'}
          subtitle="financial years"
        />
        
        <MetricCard
          title="Avg Carbon Intensity"
          value={summary?.environmental?.avgCarbonIntensity?.toFixed(3) || 'N/A'}
          subtitle="T CO2e / INR"
        />
        
        <MetricCard
          title="Avg Diversity Ratio"
          value={summary?.social?.avgDiversityRatio?.toFixed(1) || 'N/A'}
          subtitle="% female employees"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">ESG Metrics by Year</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="carbonIntensity" fill="#EF4444" name="Carbon Intensity" />
                <Bar dataKey="diversityRatio" fill="#3B82F6" name="Diversity %" />
                <Bar dataKey="renewableRatio" fill="#10B981" name="Renewable %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="emissions" stroke="#EF4444" name="Emissions" />
                <Line type="monotone" dataKey="employees" stroke="#3B82F6" name="Employees" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Environmental</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-green-700">Total Emissions:</span>
              <span className="font-medium text-green-900">
                {summary?.environmental?.totalEmissions?.toFixed(2) || 'N/A'} T CO2e
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Avg Renewable:</span>
              <span className="font-medium text-green-900">
                {summary?.environmental?.avgRenewableRatio?.toFixed(1) || 'N/A'}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Social</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-blue-700">Community Spend:</span>
              <span className="font-medium text-blue-900">
                {summary?.social?.totalCommunitySpend?.toFixed(2) || 'N/A'} INR
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Avg Diversity:</span>
              <span className="font-medium text-blue-900">
                {summary?.social?.avgDiversityRatio?.toFixed(1) || 'N/A'}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">Governance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-purple-700">Independent Board:</span>
              <span className="font-medium text-purple-900">
                {summary?.governance?.avgIndependentBoard?.toFixed(1) || 'N/A'}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Privacy Policies:</span>
              <span className="font-medium text-purple-900">
                {summary?.governance?.dataPrivacyPolicyCount || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">ESG Data Management</h2>
        <p className="text-gray-600">Click the edit button to modify any response data</p>
      </div>
      
      <div className="space-y-4">
        {responses.map((response, index) => (
          <div key={response.year} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Financial Year {response.year}</h3>
              
              {editingYear === response.year ? (
                <div className="flex space-x-2">
                  <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={cancelEditing}
                    disabled={saving}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing(response)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
              )}
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Environmental Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-green-700 flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Environmental
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Electricity Consumption (kWh)
                      </label>
                      {editingYear === response.year ? (
                        <input
                          type="number"
                          value={editFormData.totalElectricityConsumption || ''}
                          onChange={(e) => handleInputChange('totalElectricityConsumption', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{response.totalElectricityConsumption?.toLocaleString() || 'N/A'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Renewable Electricity (kWh)
                      </label>
                      {editingYear === response.year ? (
                        <input
                          type="number"
                          value={editFormData.renewableElectricityConsumption || ''}
                          onChange={(e) => handleInputChange('renewableElectricityConsumption', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{response.renewableElectricityConsumption?.toLocaleString() || 'N/A'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Fuel Consumption (L)
                      </label>
                      {editingYear === response.year ? (
                        <input
                          type="number"
                          value={editFormData.totalFuelConsumption || ''}
                          onChange={(e) => handleInputChange('totalFuelConsumption', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{response.totalFuelConsumption?.toLocaleString() || 'N/A'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Carbon Emissions (T CO2e)
                      </label>
                      {editingYear === response.year ? (
                        <input
                          type="number"
                          value={editFormData.carbonEmissions || ''}
                          onChange={(e) => handleInputChange('carbonEmissions', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{response.carbonEmissions?.toLocaleString() || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-blue-700 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Social
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Employees
                      </label>
                      {editingYear === response.year ? (
                        <input
                          type="number"
                          value={editFormData.totalEmployees || ''}
                          onChange={(e) => handleInputChange('totalEmployees', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{response.totalEmployees?.toLocaleString() || 'N/A'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Female Employees
                      </label>
                      {editingYear === response.year ? (
                        <input
                          type="number"
                          value={editFormData.femaleEmployees || ''}
                          onChange={(e) => handleInputChange('femaleEmployees', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{response.femaleEmployees?.toLocaleString() || 'N/A'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Average Training Hours
                      </label>
                      {editingYear === response.year ? (
                        <input
                          type="number"
                          value={editFormData.averageTrainingHours || ''}
                          onChange={(e) => handleInputChange('averageTrainingHours', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{response.averageTrainingHours || 'N/A'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Community Investment (INR)
                      </label>
                      {editingYear === response.year ? (
                        <input
                          type="number"
                          value={editFormData.communityInvestmentSpend || ''}
                          onChange={(e) => handleInputChange('communityInvestmentSpend', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{response.communityInvestmentSpend?.toLocaleString() || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Governance Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-purple-700 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Governance
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Independent Board Members (%)
                      </label>
                      {editingYear === response.year ? (
                        <input
                          type="number"
                          max="100"
                          min="0"
                          value={editFormData.independentBoardMembersPercent || ''}
                          onChange={(e) => handleInputChange('independentBoardMembersPercent', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{response.independentBoardMembersPercent || 'N/A'}%</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Privacy Policy
                      </label>
                      {editingYear === response.year ? (
                        <select
                          value={editFormData.hasDataPrivacyPolicy ? 'true' : 'false'}
                          onChange={(e) => handleBooleanChange('hasDataPrivacyPolicy', e.target.value === 'true')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">
                          {response.hasDataPrivacyPolicy ? (
                            <span className="text-green-600 flex items-center">
                              <Check className="h-4 w-4 mr-1" />
                              Yes
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center">
                              <X className="h-4 w-4 mr-1" />
                              No
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Revenue (INR)
                      </label>
                      {editingYear === response.year ? (
                        <input
                          type="number"
                          value={editFormData.totalRevenue || ''}
                          onChange={(e) => handleInputChange('totalRevenue', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{response.totalRevenue?.toLocaleString() || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculated Metrics */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Calculated Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Carbon Intensity</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {response.carbonIntensity?.toFixed(4) || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">T CO2e / INR</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Renewable Ratio</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {response.renewableElectricityRatio?.toFixed(1) || 'N/A'}%
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Diversity Ratio</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {response.diversityRatio?.toFixed(1) || 'N/A'}%
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Community Spend Ratio</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {response.communitySpendRatio?.toFixed(2) || 'N/A'}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <Loader size="lg" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeTab={activeMainTab} onTabChange={handleMainTabChange} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ESG Summary Dashboard</h1>
                <p className="text-gray-600 mt-1">Comprehensive view of your ESG performance metrics</p>
              </div>
              
              {responses.length > 0 && summary && (
                <ExportButtons 
                  responses={responses} 
                  summary={summary}
                  className="flex-shrink-0"
                />
              )}
            </div>

            {responses.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No ESG data yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by filling out your first ESG questionnaire.
                </p>
                <div className="mt-6">
                  <a
                    href="/questionnaire"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Start Questionnaire
                  </a>
                </div>
              </div>
            ) : (
              <>
                {/* Sub Navigation */}
                <div className="mb-6">
                  <nav className="flex space-x-8" aria-label="Tabs">
                    {[
                      { id: 'overview', name: 'Overview', icon: BarChart3 },
                      { id: 'data', name: 'Data Management', icon: Edit }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveSubTab(tab.id)}
                          className={`${
                            activeSubTab === tab.id
                              ? 'border-green-500 text-green-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                        >
                          <Icon className="h-4 w-4" />
                          {tab.name}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Tab Content */}
                {activeSubTab === 'overview' && renderOverview()}
                {activeSubTab === 'data' && renderDataView()}
              </>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}