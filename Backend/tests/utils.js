/**
 * Test utilities for ESG Questionnaire Backend
 * This file contains common utilities and helpers for testing
 */

/**
 * Create a mock user object
 * @param {Object} overrides - Properties to override in the default user
 * @returns {Object} Mock user object
 */
function createMockUser(overrides = {}) {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed_password123',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}

/**
 * Create a mock response object
 * @param {Object} overrides - Properties to override in the default response
 * @returns {Object} Mock response object
 */
function createMockResponse(overrides = {}) {
  return {
    id: 'response-id',
    year: 2024,
    userId: 'test-user-id',
    carbonEmissions: 100,
    waterConsumption: 200,
    energyUsage: 300,
    wasteGenerated: 50,
    employeeTurnoverRate: 10,
    workplaceAccidents: 2,
    femaleRepresentation: 45,
    minorityRepresentation: 30,
    boardIndependence: 75,
    executiveCompensationRatio: 15,
    totalElectricityConsumption: 500,
    renewableElectricityConsumption: 250,
    totalFuelConsumption: 300,
    totalEmployees: 100,
    femaleEmployees: 45,
    averageTrainingHours: 40,
    communityInvestmentSpend: 20000,
    independentBoardMembersPercent: 75,
    hasDataPrivacyPolicy: true,
    totalRevenue: 1000000,
    carbonIntensity: 0.0001,
    renewableElectricityRatio: 50,
    diversityRatio: 45,
    communitySpendRatio: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
}

/**
 * Create multiple mock responses for testing
 * @param {number} count - Number of responses to create
 * @param {Object} baseOverrides - Base properties to apply to all responses
 * @returns {Array} Array of mock response objects
 */
function createMockResponses(count = 3, baseOverrides = {}) {
  const responses = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < count; i++) {
    responses.push(createMockResponse({
      id: `response-${i + 1}`,
      year: currentYear - i,
      carbonEmissions: 100 + (i * 10),
      totalEmployees: 100 + (i * 5),
      ...baseOverrides
    }));
  }
  
  return responses;
}

/**
 * Create a mock JWT token for testing
 * @param {string} userId - User ID to encode in token
 * @returns {string} Mock JWT token
 */
function createMockToken(userId = 'test-user-id') {
  return `token_${userId}`;
}

/**
 * Create mock file buffer for testing file uploads
 * @param {string} type - File type ('pdf' or 'xlsx')
 * @param {number} size - File size in bytes
 * @returns {Object} Mock file object
 */
function createMockFile(type = 'pdf', size = 1024) {
  const mimeTypes = {
    pdf: 'application/pdf',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    txt: 'text/plain'
  };

  return {
    buffer: Buffer.alloc(size, 'dummy content'),
    filename: `test.${type}`,
    mimetype: mimeTypes[type] || 'application/octet-stream',
    size: size
  };
}

/**
 * Mock extracted data from file processing
 * @param {Object} overrides - Properties to override in the default extracted data
 * @returns {Object} Mock extracted data object
 */
function createMockExtractedData(overrides = {}) {
  return {
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
    },
    ...overrides
  };
}

/**
 * Reset all mocks to their default state
 */
function resetAllMocks() {
  global.mockPrisma.user.findUnique.mockReset();
  global.mockPrisma.user.create.mockReset();
  global.mockPrisma.user.findMany.mockReset();
  global.mockPrisma.user.update.mockReset();
  global.mockPrisma.user.delete.mockReset();
  
  global.mockPrisma.response.findUnique.mockReset();
  global.mockPrisma.response.findMany.mockReset();
  global.mockPrisma.response.create.mockReset();
  global.mockPrisma.response.update.mockReset();
  global.mockPrisma.response.delete.mockReset();
  global.mockPrisma.response.upsert.mockReset();
}

/**
 * Set up common mock implementations
 */
function setupCommonMocks() {
  // Default user mock
  global.mockPrisma.user.findUnique.mockResolvedValue(createMockUser());
  
  // Default response mocks
  global.mockPrisma.response.findMany.mockResolvedValue(createMockResponses(2));
  global.mockPrisma.response.findUnique.mockResolvedValue(createMockResponse());
  global.mockPrisma.response.upsert.mockResolvedValue(createMockResponse());
  global.mockPrisma.response.create.mockResolvedValue(createMockResponse());
  global.mockPrisma.response.delete.mockResolvedValue(createMockResponse());
}

/**
 * Validation error helper
 * @param {Array} fields - Array of field names that have validation errors
 * @returns {Object} Mock validation error response
 */
function createValidationError(fields = []) {
  return {
    errors: fields.map(field => ({
      type: 'field',
      value: '',
      msg: `${field} is invalid`,
      path: field,
      location: 'body'
    }))
  };
}

/**
 * Database error helper
 * @param {string} code - Prisma error code
 * @param {string} message - Error message
 * @returns {Error} Mock database error
 */
function createDatabaseError(code = 'P2002', message = 'Database error') {
  const error = new Error(message);
  error.code = code;
  return error;
}

/**
 * Test data generators for different scenarios
 */
const testData = {
  validUser: {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  },
  
  invalidUsers: [
    { email: 'invalid-email', password: 'password123', name: 'Test User' },
    { email: 'test@example.com', password: '123', name: 'Test User' },
    { email: 'test@example.com', password: 'password123', name: '' }
  ],
  
  validResponse: {
    year: 2024,
    carbonEmissions: 100,
    totalRevenue: 1000000,
    totalElectricityConsumption: 500,
    renewableElectricityConsumption: 250,
    totalEmployees: 100,
    femaleEmployees: 45
  },
  
  invalidResponses: [
    { year: 1999, carbonEmissions: 100 }, // Invalid year
    { year: 2024, carbonEmissions: -100 }, // Negative emissions
    { year: 2024, totalEmployees: 10.5 }, // Non-integer employees
    { year: 2024, independentBoardMembersPercent: 150 } // Invalid percentage
  ]
};

/**
 * Helper function to test endpoint with different auth scenarios
 * @param {Function} request - Supertest request function
 * @param {string} endpoint - API endpoint to test
 * @param {string} method - HTTP method
 * @param {Object} data - Request data
 * @returns {Object} Test results
 */
async function testAuthScenarios(request, endpoint, method = 'get', data = {}) {
  const results = {};
  
  // Test without token
  const noTokenReq = request(global.app)[method](endpoint);
  if (data && method !== 'get') {
    noTokenReq.send(data);
  }
  results.noToken = await noTokenReq;
  
  // Test with invalid token
  const invalidTokenReq = request(global.app)[method](endpoint)
    .set('Authorization', 'Bearer invalid-token');
  if (data && method !== 'get') {
    invalidTokenReq.send(data);
  }
  results.invalidToken = await invalidTokenReq;
  
  // Test with valid token
  const validTokenReq = request(global.app)[method](endpoint)
    .set('Authorization', `Bearer ${global.testToken}`);
  if (data && method !== 'get') {
    validTokenReq.send(data);
  }
  results.validToken = await validTokenReq;
  
  return results;
}

module.exports = {
  createMockUser,
  createMockResponse,
  createMockResponses,
  createMockToken,
  createMockFile,
  createMockExtractedData,
  resetAllMocks,
  setupCommonMocks,
  createValidationError,
  createDatabaseError,
  testData,
  testAuthScenarios
};
