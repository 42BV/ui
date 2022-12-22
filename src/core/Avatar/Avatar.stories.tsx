import React from 'react';

import { Avatar } from './Avatar';
import { AvatarStack } from './AvatarStack';
import { Alert } from 'reactstrap';

export default {
  title: 'core/Avatar',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p className="mb-0">
            To be able to use Avatar, you have to add @tippyjs/react to your
            dependencies:
          </p>
          <code>npm install --save @tippyjs/react</code>
          <p className="mb-0 mt-2">
            You also have to add the stylesheet to your project
          </p>
          <code>@import &apos;tippy.js/dist/tippy.css&apos;;</code>
        </Alert>
        <Story />
      </>
    )
  ],

  parameters: {
    component: Avatar
  }
};

export const Default = {
  render: () => (
    <div className="text-center pt-5">
      <Avatar alt="lg" size="lg" src="https://picsum.photos/100/100" />
      <Avatar alt="md" size="md" src="https://picsum.photos/100/100" />
      <Avatar alt="sm" size="sm" src="https://picsum.photos/100/100" />
      <Avatar alt="xs" size="xs" src="https://picsum.photos/100/100" />
      <Avatar alt="muted avatar" src="https://picsum.photos/100/100">
        <small>John Doe</small>
      </Avatar>
    </div>
  ),

  name: 'default'
};

export const StackedAvatars = {
  render: () => (
    <div className="text-center">
      <AvatarStack>
        <Avatar
          alt="Avatar number 1"
          size="xs"
          src="https://picsum.photos/100/100"
        />
        <Avatar
          alt="Avatar number 2"
          size="xs"
          src="https://picsum.photos/100/100"
        />
        <Avatar
          alt="Avatar number 3"
          size="xs"
          src="https://picsum.photos/100/100"
        />
        <Avatar
          alt="Avatar number 4"
          size="xs"
          src="https://picsum.photos/100/100"
        />
      </AvatarStack>
    </div>
  ),

  name: 'stacked avatars'
};
