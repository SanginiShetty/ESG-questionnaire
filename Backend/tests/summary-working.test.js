const request = require('supertest');
const app = require('../src/app');

describe('Summary Routes - Working Tests', () => {
  describe('GET /api/summary', () => {
    beforeEach(() => {
      global.mockPrisma.response.findMany.mockResolvedValue([
        {
          id: 'response-1',
          year: 2024,
          userId: 'test-user-id',
          carbonEmissions: 100,
          waterConsumption: 200,
          energyUsage: 300,
          carbonIntensity: 0.5,
          renewableElectricityRatio: 0.3,
          diversityRatio: 0.4,
          communitySpendRatio: 0.1,
          communityInvestmentSpend: 10000,
          independentBoardMembersPercent: 75,
          hasDataPrivacyPolicy: true
        },
        {
          id: 'response-2',
          year: 2023,
          userId: 'test-user-id',
          carbonEmissions: 120,
          waterConsumption: 180,
          energyUsage: 320,
          carbonIntensity: 0.6,
          renewableElectricityRatio: 0.2,
          diversityRatio: 0.35,
          communitySpendRatio: 0.08,
          communityInvestmentSpend: 8000,
          independentBoardMembersPercent: 70,
          hasDataPrivacyPolicy: false
        }
      ]);
    });

    test('should return summary data when authenticated', async () => {
      const response = await request(app)
        .get('/api/summary')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('summary');
      expect(response.body.summary).toHaveProperty('totalRecords', 2);
      expect(response.body.summary).toHaveProperty('years');
      expect(response.body.summary.years).toEqual([2023, 2024]);
      expect(response.body.summary).toHaveProperty('environmental');
      expect(response.body.summary).toHaveProperty('social');
      expect(response.body.summary).toHaveProperty('governance');
    });

    test('should calculate environmental metrics correctly', async () => {
      const response = await request(app)
        .get('/api/summary')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(200);
      const env = response.body.summary.environmental;
      expect(env).toHaveProperty('totalEmissions', 220); // 100 + 120
      expect(env).toHaveProperty('avgCarbonIntensity', 0.55); // (0.5 + 0.6) / 2
      expect(env).toHaveProperty('avgRenewableRatio', 0.25); // (0.3 + 0.2) / 2
    });

    test('should calculate social metrics correctly', async () => {
      const response = await request(app)
        .get('/api/summary')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(200);
      const social = response.body.summary.social;
      expect(social).toHaveProperty('avgDiversityRatio', 0.375); // (0.4 + 0.35) / 2
      expect(social).toHaveProperty('avgCommunitySpend', 0.09); // (0.1 + 0.08) / 2
      expect(social).toHaveProperty('totalCommunitySpend', 18000); // 10000 + 8000
    });

    test('should calculate governance metrics correctly', async () => {
      const response = await request(app)
        .get('/api/summary')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(200);
      const governance = response.body.summary.governance;
      expect(governance).toHaveProperty('avgIndependentBoard', 72.5); // (75 + 70) / 2
      expect(governance).toHaveProperty('dataPrivacyPolicyCount', 1); // Only 2024 has true
    });

    test('should return empty summary for user with no responses', async () => {
      global.mockPrisma.response.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/summary')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('summary');
      expect(response.body.summary).toHaveProperty('totalRecords', 0);
      expect(response.body.summary).toHaveProperty('years', []);
    });

    test('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/api/summary');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token is required');
    });

    test('should handle database errors gracefully', async () => {
      global.mockPrisma.response.findMany.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/summary')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal server error');
    });
  });

  describe('GET /api/summary/charts', () => {
    beforeEach(() => {
      global.mockPrisma.response.findMany.mockResolvedValue([
        {
          id: 'response-1',
          year: 2024,
          userId: 'test-user-id',
          renewableElectricityConsumption: 300,
          totalElectricityConsumption: 1000,
          carbonEmissions: 100,
          scope1Emissions: 40,
          scope2Emissions: 60,
          scope3Emissions: 0
        },
        {
          id: 'response-2',
          year: 2023,
          userId: 'test-user-id',
          renewableElectricityConsumption: 200,
          totalElectricityConsumption: 800,
          carbonEmissions: 120,
          scope1Emissions: 50,
          scope2Emissions: 70,
          scope3Emissions: 0
        }
      ]);
    });

    test('should return chart data when authenticated', async () => {
      const response = await request(app)
        .get('/api/summary/charts')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('chartData');
      expect(response.body.chartData).toHaveProperty('carbonEmissions');
      expect(response.body.chartData).toHaveProperty('energyConsumption');
    });

    test('should calculate energy consumption data correctly', async () => {
      const response = await request(app)
        .get('/api/summary/charts')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(200);
      const energyData = response.body.chartData.energyConsumption;
      expect(energyData).toHaveProperty('renewable', 250); // (300 + 200) / 2
      expect(energyData).toHaveProperty('total', 900); // (1000 + 800) / 2
    });

    test('should return null chart data for user with no responses', async () => {
      global.mockPrisma.response.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/summary/charts')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('chartData', null);
    });

    test('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/api/summary/charts');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token is required');
    });

    test('should handle database errors gracefully', async () => {
      global.mockPrisma.response.findMany.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/summary/charts')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal server error');
    });
  });

  describe('GET /api/summary/export/:format', () => {
    beforeEach(() => {
      global.mockPrisma.response.findMany.mockResolvedValue([
        {
          id: 'response-1',
          year: 2024,
          userId: 'test-user-id',
          carbonEmissions: 100,
          waterConsumption: 200,
          energyUsage: 300
        }
      ]);
    });

    test('should export data in CSV format when authenticated', async () => {
      const response = await request(app)
        .get('/api/summary/export/csv')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('attachment');
    });

    test('should export data in JSON format when authenticated', async () => {
      const response = await request(app)
        .get('/api/summary/export/json')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.headers['content-disposition']).toContain('attachment');
    });

    test('should return 400 for unsupported format', async () => {
      const response = await request(app)
        .get('/api/summary/export/xml')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Unsupported export format');
    });

    test('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/api/summary/export/csv');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token is required');
    });

    test('should handle database errors gracefully', async () => {
      global.mockPrisma.response.findMany.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/summary/export/csv')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal server error');
    });
  });
});
