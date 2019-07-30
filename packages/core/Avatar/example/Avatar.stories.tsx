import React from 'react';
import { storiesOf } from '@storybook/react';

import Avatar from '../src/Avatar';
import '../src/Avatar.scss';

storiesOf('core/Avatar', module)
  .addParameters({ component: Avatar })
  .add('small', () => (
    <Avatar alt="xs" size="xs" src="https://www.placecage.com/100/100" />
  ))
  .add('medium', () => (
    <Avatar alt="md" size="md" src="https://www.placecage.com/100/100" />
  ))
  .add('large', () => (
    <Avatar alt="lg" size="lg" src="https://www.placecage.com/100/100" />
  ))
  .add('with text', () => {
    return (
      <div className="text-center">
        <Avatar alt="muted avatar" src="https://www.placecage.com/100/100">
          <small className="text-muted">John Doe</small>
        </Avatar>
      </div>
    );
  });

export const _ = '';
