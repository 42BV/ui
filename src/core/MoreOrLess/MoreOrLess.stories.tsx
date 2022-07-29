import React from 'react';
import { storiesOf } from '@storybook/react';

import { MoreOrLess } from './MoreOrLess';
import { Alert } from 'reactstrap';

storiesOf('core/MoreOrLess', module)
  .addParameters({ component: MoreOrLess })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p>To be able to use MoreOrLess, you have to add lodash to your dependencies:</p>
        <code>npm install --save lodash</code>
      </Alert>
      <Story />
    </>
  ))
  .add('default', () => {
    return (
      <div className="text-center">
        <MoreOrLess
          limit={3}
          content={['aap', 'noot', 'mies', 'huis', 'boom', 'schip'].map(
            (label) => (
              <span key={label}>{label} </span>
            )
          )}
        />
      </div>
    );
  });
