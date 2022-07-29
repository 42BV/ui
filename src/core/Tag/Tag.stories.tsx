import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Tag } from './Tag';

storiesOf('core/Tag', module)
  .addParameters({ component: Tag })
  .add('default', () => (
    <div className="text-center">
      <Tag text="Maarten" />
      <Tag text="Maarten" color="success" />
      <Tag text="Maarten" color="info" />
      <Tag text="Maarten" color="warning" />
      <Tag text="Maarten" color="danger" />
      <Tag text="Maarten" onRemove={action('on close')} />
    </div>
  ));
