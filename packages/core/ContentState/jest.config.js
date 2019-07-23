module.exports = {
  setupFiles: ['../../../setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '\\.tsx?$': 'ts-jest'
  },
  testMatch: ['**/test**/*.test.*']
};
