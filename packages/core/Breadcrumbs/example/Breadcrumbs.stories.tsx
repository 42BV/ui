import React from 'react';
import { storiesOf } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import Breadcrumbs from '../src/Breadcrumbs';

storiesOf('core/Breadcrumbs', module)
  .addParameters({ component: Breadcrumbs })
  .add('default', () => (
    <BrowserRouter>
      <Breadcrumbs
        items={[
          { name: 'Dashboard', url: '/dashboard' },
          { name: 'Users', url: '/users' }
        ]}
      />
    </BrowserRouter>
  ));
