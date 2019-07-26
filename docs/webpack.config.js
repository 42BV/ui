const path = require('path');

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.stories\.tsx?$/,
    include: [path.resolve(__dirname, '../packages/core')],
    enforce: 'pre'
  });

  return config;
};
