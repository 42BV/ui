import React from 'react';
import { storiesOf } from '@storybook/react';

import LoadingPage from './LoadingPage';

storiesOf('core/LoadingPage', module)
  .addParameters({ component: LoadingPage })
  .add('default', () => {
    return <LoadingPage className="mt-0" />;
  })
  .add('custom height', () => {
    return <LoadingPage height={200} />;
  })
  .add('custom style', () => {
    return <LoadingPage style={{ backgroundColor: 'red' }} />;
  });
