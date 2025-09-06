// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

// Mock external libraries first
jest.mock('bcryptjs', () => ({
  hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password, hash) => Promise.resolve(password === hash.replace('hashed_', '')))
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn((payload) => `token_${payload.userId}`),
  verify: jest.fn((token) => {
    const userId = token.replace('token_', '');
    return { userId };
  })
}));

// Mock Prisma client
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  response: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    upsert: jest.fn()
  },
  $disconnect: jest.fn()
};

// Mock the prisma utils
jest.mock('../src/utils/prisma', () => mockPrisma);

jest.mock('../src/utils/parser', () => ({
  parsePdf: jest.fn(() => Promise.resolve('mocked pdf content')),
  parseXlsx: jest.fn(() => Promise.resolve('mocked xlsx content')),
  extractDataWithGemini: jest.fn(() => Promise.resolve({
    environmental: {
      carbon_emissions: { value: 100 },
      water_consumption: { value: 200 },
      energy_usage: { value: 300 },
      waste_generated: { value: 50 }
    },
    social: {
      employee_turnover_rate: { value: 10 },
      workplace_accidents: { value: 2 },
      diversity_and_inclusion: {
        female_representation: { value: 45 },
        minority_representation: { value: 30 }
      }
    },
    governance: {
      board_independence: { value: 75 },
      executive_compensation_ratio: { value: 15 }
    }
  }))
}));

// Global test utilities
global.mockPrisma = mockPrisma;
global.testUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed_password123'
};

global.testToken = 'token_test-user-id';

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Cleanup after all tests
afterAll(async () => {
  // Any cleanup logic
});
