import { configure } from '@storybook/react';

import '../src/core/main.scss';

const context = require.context('../src/', true, /\.stories\.tsx$/);
configure(context, module);
