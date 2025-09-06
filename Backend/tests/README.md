# Backend Testing Guide

This directory contains comprehensive Jest tests for the ESG Questionnaire Backend API.

## Test Structure

```
tests/
├── setup.js              # Global test setup and mocking
├── utils.js               # Test utilities and helpers
├── auth.test.js           # Authentication route tests
├── responses.test.js      # Response data route tests
├── summary.test.js        # Summary and charts route tests
├── app.test.js            # Health checks and general app tests
└── middleware.test.js     # Middleware integration tests
```

## Test Coverage

### Authentication Routes (`/api/auth`)
- ✅ User registration with validation
- ✅ User login with credential verification
- ✅ Current user retrieval
- ✅ Email normalization and validation
- ✅ Password hashing and comparison
- ✅ JWT token generation and verification

### Response Routes (`/api/responses`)
- ✅ File upload and processing (PDF/Excel)
- ✅ Response data CRUD operations
- ✅ Data validation and sanitization
- ✅ Derived metrics calculation
- ✅ Year-based filtering
- ✅ Authentication middleware integration

### Summary Routes (`/api/summary`)
- ✅ Dashboard summary generation
- ✅ Chart data calculations
- ✅ Statistical aggregations
- ✅ Trend analysis
- ✅ ESG metrics breakdown
- ✅ Edge cases with null/missing data

### Application Features
- ✅ Health check endpoints
- ✅ CORS configuration
- ✅ Error handling middleware
- ✅ 404 route handling
- ✅ Security headers and data sanitization

### Middleware
- ✅ JWT authentication middleware
- ✅ Input validation middleware
- ✅ File upload middleware
- ✅ Error handling chain
- ✅ Request/response processing

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test auth.test.js
npm test responses.test.js
npm test summary.test.js
npm test app.test.js
npm test middleware.test.js
```

### Run Tests with Verbose Output
```bash
npm test -- --verbose
```

## Test Configuration

### Environment Variables
The test environment uses the following mocked environment variables:
- `NODE_ENV=test`
- `JWT_SECRET=test-jwt-secret-key-for-testing-only`
- `JWT_EXPIRES_IN=1h`
- `DATABASE_URL=postgresql://test:test@localhost:5432/test_db`

### Mocked Dependencies
- **Prisma Client**: All database operations are mocked
- **bcryptjs**: Password hashing is mocked for consistent testing
- **jsonwebtoken**: JWT operations are mocked with predictable tokens
- **File Parsers**: PDF and Excel parsing is mocked with sample data
- **Gemini AI**: Data extraction is mocked with structured ESG data

## Test Utilities

The `tests/utils.js` file provides helpful utilities:

### Mock Data Creators
```javascript
const { createMockUser, createMockResponse, createMockFile } = require('./utils');

// Create a mock user
const user = createMockUser({ email: 'custom@example.com' });

// Create mock response data
const response = createMockResponse({ year: 2023, carbonEmissions: 150 });

// Create mock file for upload testing
const file = createMockFile('pdf', 2048);
```

### Test Helpers
```javascript
const { testAuthScenarios, setupCommonMocks, resetAllMocks } = require('./utils');

// Test endpoint with different auth scenarios
const results = await testAuthScenarios(request(app), '/api/protected-endpoint');

// Set up common mock implementations
setupCommonMocks();

// Reset all mocks between tests
resetAllMocks();
```

## Best Practices

### 1. Test Isolation
- Each test file focuses on a specific route or feature
- Mocks are reset between tests to prevent interference
- Global test utilities maintain consistency

### 2. Comprehensive Coverage
- Test both success and failure scenarios
- Validate error messages and status codes
- Test edge cases and boundary conditions
- Include authentication and authorization tests

### 3. Realistic Data
- Use realistic ESG data in tests
- Test with various data types and ranges
- Include null/undefined value handling
- Test calculated metrics and aggregations

### 4. Modular Structure
- Separate test files for each major component
- Shared utilities for common patterns
- Clear test descriptions and grouping
- Consistent naming conventions

## Test Data Examples

### Valid User Registration
```javascript
{
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
}
```

### Valid ESG Response Data
```javascript
{
  year: 2024,
  carbonEmissions: 100,
  totalRevenue: 1000000,
  totalElectricityConsumption: 500,
  renewableElectricityConsumption: 250,
  totalEmployees: 100,
  femaleEmployees: 45,
  independentBoardMembersPercent: 75,
  hasDataPrivacyPolicy: true
}
```

## Debugging Tests

### View Test Output
```bash
npm test -- --verbose --no-coverage
```

### Run Single Test
```bash
npm test -- --testNamePattern="should register a new user"
```

### Debug Mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Coverage Goals

Target coverage metrics:
- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

## Contributing

When adding new features:
1. Write tests for new routes/endpoints
2. Update existing tests if modifying functionality
3. Maintain test isolation and independence
4. Follow established naming conventions
5. Update this README if adding new test categories

## Common Issues

### Mock Persistence
If mocks seem to persist between tests, ensure `resetAllMocks()` is called in `beforeEach()`.

### Authentication Issues
Verify that the global `testToken` and `testUser` are properly set up in `setup.js`.

### File Upload Tests
Remember to set proper Content-Type headers when testing multipart form data.

### Database Mocking
All Prisma operations are mocked. Verify mock implementations match expected behavior.
