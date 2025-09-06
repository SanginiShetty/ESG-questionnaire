const request = require('supertest');
const app = require('../src/app');

describe('App Integration Tests - Working', () => {
  describe('Health Check Endpoints', () => {
    test('should respond to health check', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Server is running!');
      expect(response.body).toHaveProperty('timestamp');
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });

    test('should respond to protected health check with valid token', async () => {
      const response = await request(app)
        .get('/api/protected-health')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Protected route is working!');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.user).toHaveProperty('userId', 'test-user-id');
    });

    test('should reject protected health check without token', async () => {
      const response = await request(app)
        .get('/api/protected-health');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token is required');
    });

    test('should reject protected health check with invalid token', async () => {
      const response = await request(app)
        .get('/api/protected-health')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Invalid or expired token');
    });
  });

  describe('CORS Configuration', () => {
    test('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.headers).toHaveProperty('access-control-allow-origin', '*');
    });

    test('should handle preflight requests', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');

      expect(response.status).toBe(204);
    });

    test('should handle preflight for protected routes', async () => {
      const response = await request(app)
        .options('/api/protected-health')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'Authorization');

      expect(response.status).toBe(204);
    });
  });

  describe('JSON Parsing', () => {
    test('should parse JSON request bodies', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });

      // Should process the JSON body (whether successful or not)
      expect(response.status).not.toBe(415); // Not "Unsupported Media Type"
      expect(response.headers['content-type']).toContain('application/json');
    });

    test('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}');

      expect(response.status).toBe(400);
    });

    test('should handle empty JSON body', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('Route Registration', () => {
    test('should register auth routes', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      // Should not be 404 (route exists, even if request is invalid)
      expect(response.status).not.toBe(404);
    });

    test('should register responses routes', async () => {
      const response = await request(app)
        .get('/api/responses');

      // Should not be 404 (route exists, even if unauthorized)
      expect(response.status).not.toBe(404);
      expect(response.status).toBe(401); // Should be unauthorized instead
    });

    test('should register summary routes', async () => {
      const response = await request(app)
        .get('/api/summary');

      // Should not be 404 (route exists, even if unauthorized)
      expect(response.status).not.toBe(404);
      expect(response.status).toBe(401); // Should be unauthorized instead
    });

    test('should register all auth sub-routes', async () => {
      const routes = [
        { method: 'post', path: '/api/auth/register' },
        { method: 'post', path: '/api/auth/login' },
        { method: 'get', path: '/api/auth/me' }
      ];

      for (const route of routes) {
        const response = await request(app)[route.method](route.path);
        expect(response.status).not.toBe(404);
      }
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route not found');
      expect(response.headers['content-type']).toContain('application/json');
    });

    test('should handle various HTTP methods on unknown routes', async () => {
      const methods = ['post', 'put', 'patch', 'delete'];
      
      for (const method of methods) {
        const response = await request(app)[method]('/api/unknown-route');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Route not found');
      }
    });

    test('should handle unknown nested routes', async () => {
      const response = await request(app)
        .get('/api/auth/unknown-action');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route not found');
    });

    test('should handle invalid HTTP methods on valid routes', async () => {
      const response = await request(app)
        .patch('/api/health'); // PATCH not supported on health endpoint

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });

  describe('Content Type Headers', () => {
    test('should return JSON content type for API responses', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.headers['content-type']).toContain('application/json');
    });

    test('should return JSON content type for error responses', async () => {
      const response = await request(app)
        .get('/api/unknown-route');

      expect(response.headers['content-type']).toContain('application/json');
    });

    test('should handle requests without explicit content type', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send('{"email":"test@example.com","password":"password123"}');

      expect(response.status).not.toBe(415);
    });
  });

  describe('Security Headers', () => {
    test('should not expose server information', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.headers).not.toHaveProperty('server');
      expect(response.headers).not.toHaveProperty('x-powered-by');
    });

    test('should handle large request bodies gracefully', async () => {
      const largeData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'A'.repeat(10000) // Very long name
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(largeData);

      // Should handle it gracefully (either accept or reject properly)
      expect([400, 413, 500]).toContain(response.status);
    });
  });

  describe('Environment Configuration', () => {
    test('should load environment variables', async () => {
      // Test that JWT_SECRET is available (indirectly through token generation)
      expect(process.env.JWT_SECRET).toBeDefined();
      expect(process.env.NODE_ENV).toBe('test');
    });

    test('should use test database configuration', async () => {
      expect(process.env.DATABASE_URL).toContain('test');
    });
  });
});
