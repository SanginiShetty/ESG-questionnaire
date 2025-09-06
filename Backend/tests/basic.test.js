describe('Basic Test Setup', () => {
  test('should run a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should have access to mocked utilities', () => {
    expect(global.mockPrisma).toBeDefined();
    expect(global.testUser).toBeDefined();
    expect(global.testToken).toBeDefined();
  });
});
