module.exports = {
  stories: ['../src/**/*.stories.@(js|mxs|tsx|ts)'],
  addons: [
    '@storybook/addon-actions/register',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true
      }
    },
    '@storybook/preset-scss'
  ],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};
