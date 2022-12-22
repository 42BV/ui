/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  stories: ['../src/**/*.stories.@(js|mxs|tsx|ts)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-essentials'
  ],
  docs: {
    autodocs: 'tag'
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true
    }
  }
};
export default config;
