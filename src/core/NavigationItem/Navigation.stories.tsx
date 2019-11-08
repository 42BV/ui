import React from 'react';
import { storiesOf } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import NavigationItem from './NavigationItem';

storiesOf('core|NavigationItem', module)
  .addParameters({ component: NavigationItem })
  .add('default', () => {
    return (
      <BrowserRouter>
        <NavigationItem to="/dashboard" icon="dashboard" text="Dashboard" />
      </BrowserRouter>
    );
  })
  .add('with show boolean', () => {
    return (
      <BrowserRouter>
        <NavigationItem
          show={true}
          to="/dashboard"
          icon="dashboard"
          text="Dashboard"
        />
      </BrowserRouter>
    );
  })
  .add('with show as function', () => {
    return (
      <BrowserRouter>
        <NavigationItem
          show={() => true && true}
          to="/dashboard"
          icon="dashboard"
          text="Dashboard"
        />
      </BrowserRouter>
    );
  })
  .add('with exact is false', () => {
    return (
      <BrowserRouter>
        <NavigationItem
          to="/dashboard"
          icon="dashboard"
          text="Dashboard"
          exact={false}
        />
      </BrowserRouter>
    );
  });
