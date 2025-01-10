export default {
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['/tests/e2e/'],
  testMatch: ['**/tests/unit/**/*.jest.spec.jsx', '**/__tests__/**/*.jest.spec.jsx'],
};