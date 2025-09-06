const request = require('supertest');
const app = require('../src/app');

describe('Auth Routes Debug', () => {
  test('should see what register returns', async () => {
    global.mockPrisma.user.findUnique.mockResolvedValue(null);
    global.mockPrisma.user.create.mockResolvedValue({
      id: 'new-user-id',
      email: 'newuser@example.com',
      name: 'New User',
      password: 'hashed_password123'
    });

    const userData = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    console.log('Response status:', response.status);
    console.log('Response body:', JSON.stringify(response.body, null, 2));

    // Just check if it's working at all
    expect(response.status).toBeDefined();
  });

  test('should see what login returns', async () => {
    global.mockPrisma.user.findUnique.mockResolvedValue({
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed_password123'
    });

    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials);

    console.log('Login Response status:', response.status);
    console.log('Login Response body:', JSON.stringify(response.body, null, 2));

    // Just check if it's working at all
    expect(response.status).toBeDefined();
  });
});
