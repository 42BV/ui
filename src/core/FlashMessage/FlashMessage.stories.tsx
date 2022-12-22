import React from 'react';
import { action } from '@storybook/addon-actions';

import { FlashMessage } from './FlashMessage';

export default {
  title: 'core/FlashMessage',

  parameters: {
    component: FlashMessage
  }
};

const DefaultStory = () => {
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
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};
