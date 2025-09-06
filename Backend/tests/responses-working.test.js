const request = require('supertest');
const app = require('../src/app');

describe('Responses Routes - Working Tests', () => {
  describe('POST /api/responses/upload', () => {
    test('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/responses/upload')
        .send({ year: 2024 });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token is required');
    });

    test('should return 403 for invalid token', async () => {
      const response = await request(app)
        .post('/api/responses/upload')
        .set('Authorization', 'Bearer invalid-token')
        .send({ year: 2024 });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Invalid or expired token');
    });

    test('should return 400 if no file uploaded', async () => {
      const response = await request(app)
        .post('/api/responses/upload')
        .set('Authorization', 'Bearer ' + global.testToken)
        .send({ year: 2024 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'No file uploaded.');
    });

    test('should return 400 if year is missing', async () => {
      const response = await request(app)
        .post('/api/responses/upload')
        .set('Authorization', 'Bearer ' + global.testToken)
        .attach('file', Buffer.from('test'), 'test.pdf');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Year is required.');
    });

    test('should return 400 if year is invalid', async () => {
      const response = await request(app)
        .post('/api/responses/upload')
        .set('Authorization', 'Bearer ' + global.testToken)
        .field('year', 'invalid-year')
        .attach('file', Buffer.from('test'), 'test.pdf');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Year is required.');
    });
  });

  describe('GET /api/responses', () => {
    beforeEach(() => {
      global.mockPrisma.response.findMany.mockResolvedValue([
        {
          id: 'response-1',
          year: 2024,
          userId: 'test-user-id',
          carbonEmissions: 100,
          waterConsumption: 200,
          energyUsage: 300,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01')
        },
        {
          id: 'response-2',
          year: 2023,
          userId: 'test-user-id',
          carbonEmissions: 120,
          waterConsumption: 180,
          energyUsage: 280,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01')
        }
      ]);
    });

    test('should return user responses when authenticated', async () => {
      const response = await request(app)
        .get('/api/responses')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('responses');
      expect(Array.isArray(response.body.responses)).toBe(true);
      expect(response.body.responses).toHaveLength(2);
      expect(response.body.responses[0]).toHaveProperty('year', 2024);
      expect(response.body.responses[1]).toHaveProperty('year', 2023);
    });

    test('should return empty array for user with no responses', async () => {
      global.mockPrisma.response.findMany.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/responses')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('responses');
      expect(Array.isArray(response.body.responses)).toBe(true);
      expect(response.body.responses).toHaveLength(0);
    });

    test('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/api/responses');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token is required');
    });

    test('should handle database errors gracefully', async () => {
      global.mockPrisma.response.findMany.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/responses')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal server error');
    });
  });

  describe('GET /api/responses/:year', () => {
    beforeEach(() => {
      global.mockPrisma.response.findUnique.mockResolvedValue({
        id: 'response-1',
        year: 2024,
        userId: 'test-user-id',
        carbonEmissions: 100,
        waterConsumption: 200,
        energyUsage: 300,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      });
    });

    test('should return specific year response when authenticated', async () => {
      const response = await request(app)
        .get('/api/responses/2024')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('response');
      expect(response.body.response).toHaveProperty('year', 2024);
      expect(response.body.response).toHaveProperty('carbonEmissions', 100);
      expect(response.body.response).toHaveProperty('waterConsumption', 200);
    });

    test('should return 404 if response not found', async () => {
      global.mockPrisma.response.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/responses/2023')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Response not found for this year');
    });

    test('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .get('/api/responses/2024');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token is required');
    });

    test('should handle invalid year parameter', async () => {
      const response = await request(app)
        .get('/api/responses/invalid-year')
        .set('Authorization', 'Bearer ' + global.testToken);

      // This should still work as the year is passed as a string parameter
      expect(response.status).toBe(404);
    });

    test('should handle database errors gracefully', async () => {
      global.mockPrisma.response.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/responses/2024')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal server error');
    });
  });

  describe('PUT /api/responses/:year', () => {
    beforeEach(() => {
      global.mockPrisma.response.findUnique.mockResolvedValue({
        id: 'response-1',
        year: 2024,
        userId: 'test-user-id'
      });
      global.mockPrisma.response.update.mockResolvedValue({
        id: 'response-1',
        year: 2024,
        userId: 'test-user-id',
        carbonEmissions: 150,
        waterConsumption: 250
      });
    });

    test('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .put('/api/responses/2024')
        .send({
          carbonEmissions: 150,
          waterConsumption: 250
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token is required');
    });

    test('should return 404 if response not found', async () => {
      global.mockPrisma.response.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/responses/2024')
        .set('Authorization', 'Bearer ' + global.testToken)
        .send({
          carbonEmissions: 150,
          waterConsumption: 250
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Response not found for this year');
    });
  });

  describe('DELETE /api/responses/:year', () => {
    beforeEach(() => {
      global.mockPrisma.response.findUnique.mockResolvedValue({
        id: 'response-1',
        year: 2024,
        userId: 'test-user-id'
      });
      global.mockPrisma.response.delete.mockResolvedValue({
        id: 'response-1',
        year: 2024,
        userId: 'test-user-id'
      });
    });

    test('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .delete('/api/responses/2024');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token is required');
    });

    test('should return 404 if response not found', async () => {
      global.mockPrisma.response.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/responses/2024')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Response not found for this year');
    });
  });
});
