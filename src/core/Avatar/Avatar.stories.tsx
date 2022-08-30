import React from 'react';
import { storiesOf } from '@storybook/react';

import { Avatar } from './Avatar';
import { AvatarStack } from './AvatarStack';
import { Alert } from 'reactstrap';

storiesOf('core/Avatar', module)
  .addParameters({ component: Avatar })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p className="mb-0">To be able to use Avatar, you have to add @tippyjs/react to your dependencies:</p>
        <code>npm install --save @tippyjs/react</code>
        <p className="mb-0 mt-2">You also have to add the stylesheet to your project</p>
        <code>@import &apos;tippy.js/dist/tippy.css&apos;;</code>
      </Alert>
      <Story />
    </>
  ))
  .add('default', () => (
    <div className="text-center pt-5">
      <Avatar alt="lg" size="lg" src="https://www.placecage.com/100/100" />
      <Avatar alt="md" size="md" src="https://www.placecage.com/100/100" />
      <Avatar alt="sm" size="sm" src="https://www.placecage.com/100/100" />
      <Avatar alt="xs" size="xs" src="https://www.placecage.com/100/100" />
      <Avatar alt="muted avatar" src="https://www.placecage.com/100/100">
        <small>John Doe</small>
      </Avatar>
    </div>
  ))
  .add('stacked avatars', () => (
    <div className="text-center">
      <AvatarStack>
        <Avatar
          alt="Avatar number 1"
          size="xs"
          src="https://www.placecage.com/100/100"
        />
        <Avatar
          alt="Avatar number 2"
          size="xs"
          src="https://www.placecage.com/100/100"
        />
        <Avatar
          alt="Avatar number 3"
          size="xs"
          src="https://www.placecage.com/100/100"
        />
        <Avatar
          alt="Avatar number 4"
          size="xs"
          src="https://www.placecage.com/100/100"
        />
      </AvatarStack>
    </div>
  ));
