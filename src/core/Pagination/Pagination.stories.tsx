import React, { useState } from 'react';
import { range } from 'lodash';

import { pageOf } from '../../utilities/page/page';

import { Pagination } from './Pagination';
import { Alert } from 'reactstrap';

export default {
  title: 'core/Pagination',

  decorators: [
    (Story) => (
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
    )
  ],

  parameters: {
    component: Pagination
  }
};

const DefaultStory = () => {
  const [pageNumber, setPageNumber] = useState(5);

  const page = pageOf(range(1, 100), pageNumber, 10);

  return (
    <div className="d-flex justify-content-center">
      <Pagination page={page} onChange={setPageNumber} />
    </div>
  );
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};

const WithoutPreviousAndNextStory = () => {
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
};

export const WithoutPreviousAndNext = {
  render: WithoutPreviousAndNextStory,
  name: 'without previous and next'
};

const WithChangeablePageSizeStory = () => {
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
};

export const WithChangeablePageSize = {
  render: WithChangeablePageSizeStory,
  name: 'with changeable page size'
};

const WithAllowedPageSizesStory = () => {
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
};

export const WithAllowedPageSizes = {
  render: WithAllowedPageSizesStory,
  name: 'with allowed page sizes'
};
