module.exports = {
  setupFiles: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '\\.tsx?$': 'ts-jest'
  },
  testMatch: ['**/test**/*.test.*']
};
