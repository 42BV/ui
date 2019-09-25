module.exports = [
  {
    name: '@storybook/preset-typescript',
    options: {
      tsLoaderOptions: {
        compilerOptions: {
          declaration: false
        }
      }
    }
  },
  '@storybook/addon-docs/react/preset',
  '@storybook/preset-scss'
];
