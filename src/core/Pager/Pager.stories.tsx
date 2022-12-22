import React, { useState } from 'react';

import { Pager } from './Pager';
import { pageOf } from '../../utilities/page/page';
import { Alert } from 'reactstrap';
import { Card } from '../Card/Card';

export default {
  title: 'core/Pager',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p>
            To be able to use Pager, you have to add @42.nl/spring-connect to
            your dependencies:
          </p>
          <code>npm install --save @42.nl/spring-connect</code>
        </Alert>
        <Story />
      </>
    )
  ],

  parameters: {
    component: Pager
  }
};

const DefaultStory = () => {
  const [pageNumber, setPageNumber] = useState(1);

  const page = pageOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], pageNumber, 2);

  return (
    <Card>
      <span className="d-block fs-2">You are on page {pageNumber}</span>

      <Pager page={page} onChange={setPageNumber} />
    </Card>
  );
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};
