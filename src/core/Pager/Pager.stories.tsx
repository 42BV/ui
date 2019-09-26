import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Pager from './Pager';

storiesOf('core|Pager', module)
  .addParameters({ component: Pager })
  .add('default', () => {
    const page = {
      content: [1, 2, 3],
      last: false,
      totalElements: 100,
      totalPages: 10,
      size: 10,
      number: 5,
      first: false,
      numberOfElements: 10
    };

    return (
      <div className="text-center">
        <Pager page={page} onChange={action('page changed')} />
      </div>
    );
  });
