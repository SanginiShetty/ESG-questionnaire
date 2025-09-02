export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface ESGResponse {
  id?: string;
  year: number;
  // Environmental
  totalElectricityConsumption?: number;
  renewableElectricityConsumption?: number;
  totalFuelConsumption?: number;
  carbonEmissions?: number;
  // Social
  totalEmployees?: number;
  femaleEmployees?: number;
  averageTrainingHours?: number;
  communityInvestmentSpend?: number;
  // Governance
  independentBoardMembersPercent?: number;
  hasDataPrivacyPolicy?: boolean;
  totalRevenue?: number;
  // Calculated
  carbonIntensity?: number;
  renewableElectricityRatio?: number;
  diversityRatio?: number;
  communitySpendRatio?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SummaryData {
  totalRecords: number;
  years: number[];
  environmental: {
    avgCarbonIntensity: number | null;
    avgRenewableRatio: number | null;
    totalEmissions: number | null;
  };
  social: {
    avgDiversityRatio: number | null;
    avgCommunitySpend: number | null;
    totalCommunitySpend: number | null;
  };
  governance: {
    avgIndependentBoard: number | null;
    dataPrivacyPolicyCount: number;
  };
}

export interface ChartData {
  carbonEmissions: {
    breakdown: Array<{ name: string; value: number }>;
  };
  energyConsumption: {
    renewable: number;
    total: number;
    fuelConsumption: number;
    breakdown: Array<{ name: string; value: number }>;
  };
  diversityBreakdown: Array<{ name: string; value: number }>;
  yearlyTrends: Array<{
    year: number;
    carbonIntensity: number;
    renewableRatio: number;
    diversityRatio: number;
    communitySpendRatio: number;
    carbonEmissions: number;
    totalEmployees: number;
  }>;
  communityInvestment: Array<{ name: string; value: number }>;
  boardComposition: Array<{ name: string; value: number }>;
  employeeMetrics: {
    totalEmployees: number;
    avgTrainingHours: number;
    totalCommunitySpend: number;
  };
  governanceMetrics: {
    avgIndependentBoard: number;
    dataPrivacyCompliance: number;
    avgRevenue: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Array<{ msg: string; param: string }>;
}