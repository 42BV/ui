const path = require('path');

module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.stories\.tsx?$/,
    loaders: [require.resolve('@storybook/source-loader')],
    include: [path.resolve(__dirname, '../core')],
    enforce: 'pre'
  });
  return config;
};
