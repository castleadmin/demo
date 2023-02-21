const nxPreset = require('@nrwl/jest/preset').default;

module.exports = {
  ...nxPreset,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/index.{ts,tsx}',
    '!src/environments/environment.ts',
    '!src/environments/environment.test.ts',
    '!src/environments/environment.production.ts',
  ],
  coverageReporters: ['clover', 'json', 'lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: ['src/environments/environment.test.ts'],
};
