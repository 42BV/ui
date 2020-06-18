import React from 'react';
import { storiesOf } from '@storybook/react';

import Avatar from './Avatar';
import AvatarStack from './AvatarStack';

storiesOf('core|Avatar', module)
  .addParameters({ component: Avatar })
  .add('default', () => (
    <div className="text-center pt-5">
      <Avatar alt="lg" size="lg" src="https://www.placecage.com/100/100" />
      <Avatar alt="md" size="md" src="https://www.placecage.com/100/100" />
      <Avatar alt="sm" size="sm" src="https://www.placecage.com/100/100" />
      <Avatar alt="xs" size="xs" src="https://www.placecage.com/100/100" />
      <Avatar alt="muted avatar" src="https://www.placecage.com/100/100">
        <small className="text-muted">John Doe</small>
      </Avatar>
    </div>
  ))
  .add('stacked avatars', () => (
    <div className="text-center">
      <AvatarStack>
        <Avatar
          alt="Avatar numbero 1"
          size="xs"
          src="https://www.placecage.com/100/100"
        />
        <Avatar
          alt="Avatar numbero 2"
          size="xs"
          src="https://www.placecage.com/100/100"
        />
        <Avatar
          alt="Avatar numbero 3"
          size="xs"
          src="https://www.placecage.com/100/100"
        />
        <Avatar
          alt="Avatar numbero 4"
          size="xs"
          src="https://www.placecage.com/100/100"
        />
      </AvatarStack>
    </div>
  ));
