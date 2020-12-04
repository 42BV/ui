import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import TextButton from './TextButton';

storiesOf('core/buttons/TextButton', module)
  .addParameters({ component: TextButton })
  .add('default', () => {
    return (
      <div className="text-center mt-5">
        <TextButton onClick={action('onClick')}>Clear</TextButton>
      </div>
    );
  });
