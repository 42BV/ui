import React from 'react';

import { OrSeparator } from './OrSeparator';

export default {
  title: 'core/OrSeparator',

  parameters: {
    component: OrSeparator
  }
};

const BasicStory = () => {
  return (
    <div className="text-center">
      <p>You should do this</p>
      <OrSeparator />
      <p>something entirely different</p>
    </div>
  );
};

export const Basic = {
  render: BasicStory,
  name: 'basic'
};
