import { load, addParameters } from '@storybook/react';
import { DocsPage } from '@storybook/addon-docs/blocks';

// eslint-disable-next-line import/no-unresolved
import '!style-loader!css-loader!@42.nl/ui-styling';

addParameters({
  docs: DocsPage
});

load(
  require.context('../packages/core/', true, /\.stories\.(tsx|mdx)$/),
  module
);
