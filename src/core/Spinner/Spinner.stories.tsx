import React from 'react';
import { storiesOf } from '@storybook/react';

import { Spinner } from './Spinner';

storiesOf('core/Spinner', module)
  .addParameters({ component: Spinner })
  .add('default', () => {
    return (
      <div className="text-center">
        <Spinner color="" size={42} />
        <hr />
        <Spinner color="red" size={42} />
        <Spinner color="white" size={42} />
        <Spinner color="blue" size={42} />
        <hr />
        <Spinner color="orange" size={16} />
        <hr />
        <Spinner color="purple" size={500} />
      </div>
    );
  });
