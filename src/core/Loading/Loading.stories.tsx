import React from 'react';

import { Loading } from './Loading';

export default {
  title: 'core/Loading',

  parameters: {
    component: Loading
  }
};

const DefaultStory = () => {
  return <Loading />;
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};

const CustomTextStory = () => {
  return (
    <Loading>
      We are <b>loading</b> the world!
    </Loading>
  );
};

export const CustomText = {
  render: CustomTextStory,
  name: 'custom text'
};
