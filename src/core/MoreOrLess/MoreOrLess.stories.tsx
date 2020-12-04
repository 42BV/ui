import React from 'react';
import { storiesOf } from '@storybook/react';

import MoreOrLess from './MoreOrLess';

storiesOf('core/MoreOrLess', module)
  .addParameters({ component: MoreOrLess })
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
