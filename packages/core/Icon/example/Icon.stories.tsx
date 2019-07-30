import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Icon from '../src/Icon';

storiesOf('core/Icons', module)
  .addParameters({ component: Icon })
  .add('available icons', () => {
    return (
      <iframe
        style={{
          height: '100vh',
          width: '100%',
          border: 0
        }}
        title="Material.io icons"
        src="https://material.io/tools/icons/?icon=call_made&style=baseline"
      />
    );
  })
  .add('examples', () => {
    return (
      <div className="text-center">
        <Icon icon="child_care" color="danger" />
        <Icon icon="adb" color="info" />
        <Icon icon="restaurant" color="muted" />
        <Icon icon="train" color="primary" />
        <Icon icon="wb_sunny" color="warning" />
        <Icon icon="drafts" />
        <Icon icon="timer_3" onClick={action('timer clicked')} />
      </div>
    );
  });

export const _ = '';
