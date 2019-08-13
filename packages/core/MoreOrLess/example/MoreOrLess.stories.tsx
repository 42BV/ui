import React from 'react';
import { storiesOf } from '@storybook/react';

import MoreOrLess from '../src/MoreOrLess';

storiesOf('core|MoreOrLess', module)
  .addParameters({ component: MoreOrLess })
  .add('default', () => {
    return (
      <div className="text-center">
        <MoreOrLess
          limit={3}
          content={['aap', 'noot', 'mies', 'huis', 'boom', 'ship'].map(
            label => (
              <span key={label}>{label} </span>
            )
          )}
        />
      </div>
    );
  });
