import { load, addParameters } from '@storybook/react';
import { DocsPage } from '@storybook/addon-docs/blocks';

let context;
const importAll = r => r.keys().forEach(r);

if (process.env.STORYBOOK_MODE === 'isolated') {
  context = require.context(
    process.env.STORYBOOK_COMPONENT,
    true,
    /\.stories\.tsx$/
  );

  const styles = require.context(
    process.env.STORYBOOK_COMPONENT,
    true,
    /\.scss$/
  );

  importAll(styles);
} else {
  context = require.context('../packages/', true, /\.stories\.tsx$/);
  require('@42.nl/ui/lib/scss/main.scss');
}

addParameters({
  docs: DocsPage
});

load(context, module);
