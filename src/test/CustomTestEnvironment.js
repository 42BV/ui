const Environment = require('jest-environment-jsdom');

/**
 * A custom environment to set the TextEncoder that is required for React Quill.
 */
class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder } = require('util');
      this.global.TextEncoder = TextEncoder;
    }
  }
}

module.exports.CustomTestEnvironment = CustomTestEnvironment;
