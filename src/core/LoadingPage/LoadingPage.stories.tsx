import React from 'react';
import { storiesOf } from '@storybook/react';

import LoadingPage from './LoadingPage';

storiesOf('core|LoadingPage', module)
  .addParameters({ component: LoadingPage })
  .add('default', () => {
    return <LoadingPage className="mt-0" />;
  });