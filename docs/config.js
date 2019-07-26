import { load, addParameters } from '@storybook/react';
import { DocsPage } from '@storybook/addon-docs/blocks';

addParameters({
  docs: DocsPage
});

load(
  require.context('../packages/core', true, /\.stories\.(tsx|mdx)$/),
  module
);
