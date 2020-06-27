// jest.config.js
const { defaults } = require('jest-config')

module.exports = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'vue'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  "transform": {
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.ts$": "<rootDir>/node_modules/babel-jest",
    ".*\\.(vue)$": "<rootDir>/node_modules/vue-jest"
  }
}
