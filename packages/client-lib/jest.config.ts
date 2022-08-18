/* eslint-disable */
export default {
  displayName: 'client-lib',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/"
  ],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/client-lib',
};
