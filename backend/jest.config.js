module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/jest.config.js'],
  testMatch: ['**/test/**/*.test.js'],
  forceExit: true,
  detectOpenHandles: true,
  testTimeout: 30000
};