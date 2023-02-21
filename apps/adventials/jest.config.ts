/* eslint-disable */
export default {
  displayName: 'adventials',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/adventials',
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!*.d.ts',
    '!pages/_document.tsx',
    '!environments/environment.ts',
    '!jest.config.ts',
    '!sentry.client.config.ts',
    '!sentry.server.config.ts',
  ],
};
