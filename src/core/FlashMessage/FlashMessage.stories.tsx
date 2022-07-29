import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { FlashMessage } from './FlashMessage';

storiesOf('core/FlashMessage', module)
  .addParameters({ component: FlashMessage })
  .add('default', () => {
    return (
      <>
        <FlashMessage color="success" onClose={action('success closed')}>
          Success
        </FlashMessage>
        <FlashMessage color="danger" onClose={action('danger closed')}>
          Warning
        </FlashMessage>
        <FlashMessage color="warning" onClose={action('warning closed')}>
          Warning
        </FlashMessage>
        <FlashMessage color="info" onClose={action('info closed')}>
          Info
        </FlashMessage>
      </>
    );
  });
