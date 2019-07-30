import React from 'react';
import { storiesOf } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import NavigationItem from '../src/NavigationItem';

storiesOf('core/NavigationItem', module)
  .addParameters({ component: NavigationItem })
  .add('default', () => {
    return (
      <BrowserRouter>
        <NavigationItem to="/dashboard" icon="dashboard" text="Dashboard" />
      </BrowserRouter>
    );
  });
