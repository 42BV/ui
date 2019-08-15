import React from 'react';
import { storiesOf } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import Breadcrumbs from '../src/Breadcrumbs';

storiesOf('core|Breadcrumbs', module)
  .addParameters({ component: Breadcrumbs })
  .add('default', () => (
    <BrowserRouter>
      <Breadcrumbs
        items={[
          { name: 'Dashboard', url: '/dashboard' },
          { name: 'Users', url: '/users' },
          { name: 'Library', active: true }
        ]}
      />
    </BrowserRouter>
  ))
  .add('example with header', () => (
    <BrowserRouter>
      <div className="d-flex align-items-center mb-4 mt-4">
        <h2 className="flex-fill">Test</h2>
        <Breadcrumbs
          items={[
            { name: 'Dashboard', url: '/dashboard' },
            { name: 'Users', url: '/users' },
            { name: 'Library', active: true }
          ]}
        />
      </div>
    </BrowserRouter>
  ));
