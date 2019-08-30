import { configure } from '@storybook/react';

import '../src/main.scss';

const context = require.context('../src/', true, /\.stories\.tsx$/);
configure(context, module);
