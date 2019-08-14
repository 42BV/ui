import { configure, addParameters } from '@storybook/react';
import { DocsPage } from '@storybook/addon-docs/blocks';

let context;
const importAll = r => r.keys().forEach(r);

/**
 * We provide the ability to develop components in isolation by running `yarn dev` within a component' folder.
 */
if (process.env.STORYBOOK_MODE === 'isolated') {
  context = require.context(
    process.env.STORYBOOK_COMPONENT,
    true,
    /\.stories\.tsx$/
  );

  /**
   * When developing a component in isolation, we have to require the styling with all imports intact,
   * therefore we must resolve it from the `src` folder, instead of the `lib` folder.
   */
  const styles = require.context(
    `${process.env.STORYBOOK_COMPONENT}/src`,
    true,
    /\.scss$/
  );

  importAll(styles);
} else {
  context = require.context('../packages/', true, /\.stories\.tsx$/);
  require('./main.scss');
}

addParameters({
  docs: DocsPage
});

configure(context, module);
