import React, { useState } from 'react';
import { range } from 'lodash';

import { pageOf } from '../../utilities/page/page';

import Pagination from './EpicPagination';

export default {
  title: 'core/EpicPagination',

  parameters: {
    component: Pagination
  }
};

const DefaultStory = () => {
  const [pageNumber, setPageNumber] = useState(5);

  const page = pageOf(range(0, 100), pageNumber, 10);

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
