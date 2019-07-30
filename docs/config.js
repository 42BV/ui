import { load, addParameters } from '@storybook/react';
import { DocsPage } from '@storybook/addon-docs/blocks';

// eslint-disable-next-line import/no-unresolved
import '@42.nl/ui-core-styling/dist/scss/main.scss';

addParameters({
  docs: DocsPage
});

load(
  require.context('../packages/core/', true, /\.stories\.(tsx|mdx)$/),
  module
);
