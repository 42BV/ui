import { storiesOf } from '@storybook/react';
import { CheckBox } from './CheckBox';
import React, { useState } from 'react';

storiesOf('Core/CheckBox', module)
  .addParameters({ component: CheckBox })
  .add('basic', () => {
    const [primary, setPrimary] = useState(false);

    return (
      <div className={'text-center'}>
        <CheckBox
          onChange={() => setPrimary(!primary)}
          checked={!primary}
          color={'primary'}
          ariaLabel={'primary'}
        />
      </div>
    );
  });
