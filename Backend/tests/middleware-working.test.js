const request = require('supertest');
const app = require('../src/app');

describe('Middleware - Working Tests', () => {
  describe('Authentication Middleware', () => {
    test('should allow access with valid token format', async () => {
      // Note: JWT verification might not work perfectly in test environment
      // but we can test the token format validation
      const response = await request(app)
        .get('/api/protected-health')
        .set('Authorization', 'Bearer ' + global.testToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Protected route is working!');
      expect(response.body).toHaveProperty('user');
    });

    test('should deny access without token', async () => {
      const response = await request(app)
        .get('/api/protected-health');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token is required');
    });

    test('should deny access with invalid token', async () => {
      const response = await request(app)
        .get('/api/protected-health')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Invalid or expired token');
    });

    test('should deny access with malformed Authorization header', async () => {
      const response = await request(app)
        .get('/api/protected-health')
        .set('Authorization', 'invalid-format');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token is required');
    });

    test('should deny access with empty Authorization header', async () => {
      const response = await request(app)
        .get('/api/protected-health')
        .set('Authorization', '');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token is required');
    });

    test('should deny access with only "Bearer" in Authorization header', async () => {
      const response = await request(app)
        .get('/api/protected-health')
        .set('Authorization', 'Bearer');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Access token is required');
    });
  });

  describe('Validation Middleware', () => {
    describe('Registration Validation', () => {
      test('should validate email format', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'invalid-email',
            password: 'password123',
            name: 'Test User'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(Array.isArray(response.body.errors)).toBe(true);
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: 'Valid email is required'
            })
          ])
        );
      });

      test('should validate password length', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: '123',
            name: 'Test User'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: 'Password must be at least 6 characters'
            })
          ])
        );
      });

      test('should validate required name field', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123'
            // Missing name
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: 'Name is required'
            })
          ])
        );
      });

      test('should validate empty name field', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123',
            name: ''
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: 'Name is required'
            })
          ])
        );
      });

      test('should validate multiple fields at once', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'invalid-email',
            password: '123'
            // Missing name and invalid email/password
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors.length).toBeGreaterThanOrEqual(3); // At least 3 validation errors
      });
    });

    describe('Login Validation', () => {
      test('should validate email format in login', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'invalid-email',
            password: 'password123'
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: 'Valid email is required'
            })
          ])
        );
      });

      test('should validate required password field in login', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com'
            // Missing password
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: 'Password is required'
            })
          ])
        );
      });

      test('should validate empty password field in login', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: ''
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: 'Password is required'
            })
          ])
        );
      });
    });

    describe('Email Normalization', () => {
      test('should normalize email to lowercase', async () => {
        global.mockPrisma.user.findUnique.mockResolvedValue(null);
        global.mockPrisma.user.create.mockResolvedValue({
          id: 'new-user-id',
          email: 'test@example.com',
          name: 'Test User'
        });

        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'TEST@EXAMPLE.COM',
            password: 'password123',
            name: 'Test User'
          });

        expect(response.status).toBe(201);
        expect(global.mockPrisma.user.findUnique).toHaveBeenCalledWith({
          where: { email: 'test@example.com' }
        });
      });

      test('should handle email with extra spaces', async () => {
        global.mockPrisma.user.findUnique.mockResolvedValue(null);
        global.mockPrisma.user.create.mockResolvedValue({
          id: 'new-user-id',
          email: 'test@example.com',
          name: 'Test User'
        });

        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: '  test@example.com  ',
            password: 'password123',
            name: 'Test User'
          });

        expect(response.status).toBe(201);
      });
    });

    describe('Name Trimming', () => {
      test('should trim whitespace from name', async () => {
        global.mockPrisma.user.findUnique.mockResolvedValue(null);
        global.mockPrisma.user.create.mockResolvedValue({
          id: 'new-user-id',
          email: 'test@example.com',
          name: 'Test User'
        });

        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123',
            name: '  Test User  '
          });

        expect(response.status).toBe(201);
        // The trimmed name should be used in the create call
        expect(global.mockPrisma.user.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            name: 'Test User'
          })
        });
      });
    });
  });

  describe('Error Handling Middleware', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route not found');
    });

    test('should handle various HTTP methods on unknown routes', async () => {
      const methods = ['post', 'put', 'patch', 'delete'];
      
      for (const method of methods) {
        const response = await request(app)[method]('/api/unknown-route');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Route not found');
      }
    });

    test('should return proper content type for 404 errors', async () => {
      const response = await request(app)
        .get('/api/non-existent-route');

      expect(response.status).toBe(404);
      expect(response.headers['content-type']).toContain('application/json');
    });
  });

  describe('CORS Middleware', () => {
    test('should include CORS headers in responses', async () => {
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
  });

  describe('JSON Body Parser', () => {
    test('should parse valid JSON request bodies', async () => {
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
  });
});
