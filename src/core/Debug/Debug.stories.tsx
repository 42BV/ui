import React from 'react';

import { Debug } from './Debug';

export default {
  title: 'core/Debug',

  parameters: {
    component: Debug
  }
};

const DefaultOpenStory = () => {
  const birthday = new Date();
  birthday.setFullYear(birthday.getFullYear() - 42);

  const user = {
    firstName: 'Hank',
    lastName: 'Hankleton',
    age: 42,
    birthday
  };

  return <Debug value={user} />;
};

export const DefaultOpen = {
  render: DefaultOpenStory,
  name: 'default open'
};

const DefaultClosedStory = () => {
  const birthday = new Date();
  birthday.setFullYear(birthday.getFullYear() - 42);

  const user = {
    firstName: 'Hank',
    lastName: 'Hankleton',
    age: 42,
    birthday
  };

  return <Debug value={user} defaultOpen={false} />;
};

export const DefaultClosed = {
  render: DefaultClosedStory,
  name: 'default closed'
};
