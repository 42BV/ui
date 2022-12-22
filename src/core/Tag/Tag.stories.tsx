import React from 'react';
import { action } from '@storybook/addon-actions';

import { Tag } from './Tag';

export default {
  title: 'core/Tag',

  parameters: {
    component: Tag
  }
};

export const Default = {
  render: () => (
    <div className="text-center">
      <Tag text="Maarten" />
      <Tag text="Maarten" color="success" />
      <Tag text="Maarten" color="info" />
      <Tag text="Maarten" color="warning" />
      <Tag text="Maarten" color="danger" />
      <Tag text="Maarten" onRemove={action('on close')} />
    </div>
  ),

  name: 'default'
};
