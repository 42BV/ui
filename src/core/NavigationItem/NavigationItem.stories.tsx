import React from 'react';
import { storiesOf } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import { NavigationItem } from './NavigationItem';
import { Alert } from 'reactstrap';

storiesOf('core/NavigationItem', module)
  .addParameters({ component: NavigationItem })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p>To be able to use NavigationItem, you have to add react-router-dom to your dependencies:</p>
        <code>npm install --save react-router-dom</code>
      </Alert>
      <Story />
    </>
  ))
  .add('default', () => {
    return (
      <BrowserRouter>
        <ul>
          <NavigationItem to="/dashboard" icon="dashboard" text="Dashboard" />
        </ul>
      </BrowserRouter>
    );
  })
  .add('with show boolean', () => {
    return (
      <BrowserRouter>
        <ul>
          <NavigationItem
            show={true}
            to="/dashboard"
            icon="dashboard"
            text="Dashboard"
          />
        </ul>
      </BrowserRouter>
    );
  })
  .add('with show as function', () => {
    return (
      <BrowserRouter>
        <ul>
          <NavigationItem
            show={() => true}
            to="/dashboard"
            icon="dashboard"
            text="Dashboard"
          />
        </ul>
      </BrowserRouter>
    );
  });
