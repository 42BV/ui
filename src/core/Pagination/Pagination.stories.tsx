import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { range } from 'lodash';
import { Alert } from 'reactstrap';
import { pageOf } from '@42.nl/spring-connect';

import { Pagination } from './Pagination';

storiesOf('core/Pagination', module)
  .addParameters({ component: Pagination })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p>
          To be able to use Pagination, you have to add @42.nl/spring-connect
          and lodash to your dependencies:
        </p>
        <code>npm install --save @42.nl/spring-connect lodash</code>
      </Alert>
      <Story />
    </>
  ))
  .add('default', () => {
    const [pageNumber, setPageNumber] = useState(5);

    const page = pageOf(range(1, 100), pageNumber, 10);

    return (
      <div className="d-flex justify-content-center">
        <Pagination page={page} onChange={setPageNumber} />
      </div>
    );
  })
  .add('without previous and next', () => {
    const [pageNumber, setPageNumber] = useState(5);

    const page = pageOf(range(1, 100), pageNumber, 10);

    return (
      <div className="d-flex justify-content-center">
        <Pagination
          page={page}
          onChange={setPageNumber}
          showPreviousAndNextButtons={false}
        />
      </div>
    );
  })
  .add('without total elements', () => {
    const [pageNumber, setPageNumber] = useState(5);

    const page = pageOf(range(1, 100), pageNumber, 10);

    return (
      <div className="d-flex justify-content-center">
        <Pagination
          page={page}
          onChange={setPageNumber}
          showTotalElements={false}
        />
      </div>
    );
  })
  .add('with changeable page size', () => {
    const [pageNumber, setPageNumber] = useState(5);
    const [pageSize, setPageSize] = useState(10);

    const page = pageOf(range(1, 200), pageNumber, pageSize);

    return (
      <div className="d-flex justify-content-center">
        <Pagination
          page={page}
          onChange={setPageNumber}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPageNumber(1);
          }}
        />
      </div>
    );
  })
  .add('with allowed page sizes', () => {
    const [pageNumber, setPageNumber] = useState(5);
    const [pageSize, setPageSize] = useState(8);

    const page = pageOf(range(1, 200), pageNumber, pageSize);

    return (
      <div className="d-flex justify-content-center">
        <Pagination
          page={page}
          onChange={setPageNumber}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPageNumber(1);
          }}
          allowedPageSizes={[2, 4, 8, 16, 32]}
        />
      </div>
    );
  });
