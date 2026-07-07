import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  testMatch: ['**/test/**/*.test.ts'],
  transformIgnorePatterns: ['!node_modules/'],
};

export default config;
