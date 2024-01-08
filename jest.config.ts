import type {Config} from 'jest';
const esModules = ['lodash-es'].join('|');

const config: Config = {
  verbose: true,
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  testMatch: ['**/test/**/*.test.ts'],
  transformIgnorePatterns: ['!node_modules/'],
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },

  // transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
};

export default config;
