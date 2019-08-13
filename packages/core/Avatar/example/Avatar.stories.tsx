import React from 'react';
import { storiesOf } from '@storybook/react';

import Avatar from '../src/Avatar';

storiesOf('core|Avatar', module)
  .addParameters({ component: Avatar })
  .add('default', () => (
    <div className="text-center">
      <Avatar alt="lg" size="lg" src="https://www.placecage.com/100/100" />
      <Avatar alt="md" size="md" src="https://www.placecage.com/100/100" />
      <Avatar alt="xs" size="xs" src="https://www.placecage.com/100/100" />
      <Avatar alt="muted avatar" src="https://www.placecage.com/100/100">
        <small className="text-muted">John Doe</small>
      </Avatar>
    </div>
  ));
