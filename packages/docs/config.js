import { load, addParameters, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { DocsPage } from '@storybook/addon-docs/blocks';

addDecorator(withInfo);
addParameters({
  docs: DocsPage
});

load(require.context('../core', true, /\.stories\.(tsx|mdx)$/), module);
