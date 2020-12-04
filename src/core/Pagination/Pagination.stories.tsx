import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { range } from 'lodash';

import { pageOf } from '../../utilities/page/page';

import Pagination from './Pagination';

storiesOf('core/Pagination', module)
  .addParameters({ component: Pagination })
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
  });
