// jest.config.js
const { defaults } = require('jest-config')

module.exports = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
}
