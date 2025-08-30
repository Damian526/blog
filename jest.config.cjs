module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Changed to jsdom for React component testing
  testMatch: ['<rootDir>/__tests__/**/*.test.{ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
  },
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/styles/**',
    '!src/lib/prisma.ts', // Exclude database connection
  ],
  
};
