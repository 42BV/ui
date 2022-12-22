import React from 'react';

import { MoreOrLess } from './MoreOrLess';
import { Alert } from 'reactstrap';

export default {
  title: 'core/MoreOrLess',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p>
            To be able to use MoreOrLess, you have to add lodash to your
            dependencies:
          </p>
          <code>npm install --save lodash</code>
        </Alert>
        <Story />
      </>
    )
  ],

  parameters: {
    component: MoreOrLess
  }
};

const DefaultStory = () => {
  return (
    <div className="text-center">
      <MoreOrLess
        limit={3}
        content={['aap', 'noot', 'mies', 'huis', 'boom', 'schip'].map(
          (label) => (
            <span key={label}>{label} </span>
          )
        )}
      />
    </div>
  );
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};
