import React from 'react';
import { storiesOf } from '@storybook/react';

import Loading from './Loading';

storiesOf('core|Loading', module)
  .addParameters({ component: Loading })
  .add('default', () => {
    return <Loading />;
  })
  .add('custom text', () => {
    return (
      <Loading>
        We are <b>loading</b> the world!
      </Loading>
    );
  });
