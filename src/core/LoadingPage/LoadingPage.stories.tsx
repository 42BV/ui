import React from 'react';

import { LoadingPage } from './LoadingPage';

export default {
  title: 'core/LoadingPage',

  parameters: {
    component: LoadingPage
  }
};

const DefaultStory = () => {
  return <LoadingPage className="mt-0" />;
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};

const CustomHeightStory = () => {
  return <LoadingPage height={100} />;
};

export const CustomHeight = {
  render: CustomHeightStory,
  name: 'custom height'
};

const CustomStyleStory = () => {
  return <LoadingPage style={{ backgroundColor: 'red' }} />;
};

export const CustomStyle = {
  render: CustomStyleStory,
  name: 'custom style'
};
