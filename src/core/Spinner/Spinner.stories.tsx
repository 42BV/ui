import React from 'react';

import { Spinner } from './Spinner';

export default {
  title: 'core/Spinner',

  parameters: {
    component: Spinner
  }
};

const DefaultStory = () => {
  return (
    <div className="text-center">
      <Spinner color="" size={42} />
      <hr />
      <Spinner color="red" size={42} />
      <Spinner color="white" size={42} />
      <Spinner color="blue" size={42} />
      <hr />
      <Spinner color="orange" size={16} />
      <hr />
      <Spinner color="purple" size={500} />
    </div>
  );
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};
