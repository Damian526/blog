module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  setupFilesAfterEnv: ['./jest.setup.js'], // Optional setup
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1', // Map absolute imports
  },
};
