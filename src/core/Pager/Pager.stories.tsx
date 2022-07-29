import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { Pager } from './Pager';
import { pageOf } from '../../utilities/page/page';
import { Alert } from 'reactstrap';

storiesOf('core/Pager', module)
  .addParameters({ component: Pager })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p>To be able to use Pager, you have to add @42.nl/spring-connect to your dependencies:</p>
        <code>npm install --save @42.nl/spring-connect</code>
      </Alert>
      <Story />
    </>
  ))
  .add('default', () => {
    const [pageNumber, setPageNumber] = useState(1);

    const page = pageOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], pageNumber, 2);

    return (
      <div className="text-center">
        <h2>You are on page {pageNumber}</h2>

        <Pager page={page} onChange={setPageNumber} />
      </div>
    );
  });
