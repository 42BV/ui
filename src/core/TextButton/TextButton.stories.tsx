import React from 'react';
import { action } from '@storybook/addon-actions';

import { TextButton } from './TextButton';

export default {
  title: 'core/buttons/TextButton',

  parameters: {
    component: TextButton
  }
};

const DefaultStory = () => {
  return (
    <div className="text-center mt-5">
      <TextButton onClick={action('onClick')}>Clear</TextButton>
    </div>
  );
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};
