import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { NavigationItem } from './NavigationItem';
import { Alert } from 'reactstrap';

export default {
  title: 'core/NavigationItem',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p>
            To be able to use NavigationItem, you have to add react-router-dom
            to your dependencies:
          </p>
          <code>npm install --save react-router-dom</code>
        </Alert>
        <Story />
      </>
    )
  ],

  parameters: {
    component: NavigationItem
  }
};

const DefaultStory = () => {
  return (
    <BrowserRouter>
      <ul>
        <NavigationItem to="/dashboard" icon="dashboard" text="Dashboard" />
      </ul>
    </BrowserRouter>
  );
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};

const WithShowBooleanStory = () => {
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
};

export const WithShowBoolean = {
  render: WithShowBooleanStory,
  name: 'with show boolean'
};

const WithShowAsFunctionStory = () => {
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
};

export const WithShowAsFunction = {
  render: WithShowAsFunctionStory,
  name: 'with show as function'
};
