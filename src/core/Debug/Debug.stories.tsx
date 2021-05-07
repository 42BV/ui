import React from 'react';
import { storiesOf } from '@storybook/react';

import { Debug } from './Debug';

storiesOf('core/Debug', module)
  .addParameters({ component: Debug })
  .add('default open', () => {
    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - 42);

    const user = {
      firstName: 'Hank',
      lastName: 'Hankleton',
      age: 42,
      birthday
    };

    return <Debug value={user} />;
  })
  .add('default closed', () => {
    const birthday = new Date();
    birthday.setFullYear(birthday.getFullYear() - 42);

    const user = {
      firstName: 'Hank',
      lastName: 'Hankleton',
      age: 42,
      birthday
    };

    return <Debug value={user} defaultOpen={false} />;
  });
