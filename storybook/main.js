const path = require('path');

module.exports = {
  core: {
    builder: 'webpack5'
  },
  stories: ['../src/**/*.stories.@(js|mxs|tsx|ts)'],
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true
      }
    }
  ],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript-plugin',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true
    }
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../')
    });

    config.resolve.fallback.http = require.resolve('stream-http');
    config.resolve.fallback.https = require.resolve('https-browserify');
    config.resolve.fallback.stream = require.resolve('stream-browserify');
    config.resolve.fallback.zlib = require.resolve('browserify-zlib');

    // Return the altered config
    return config;
  }
};
