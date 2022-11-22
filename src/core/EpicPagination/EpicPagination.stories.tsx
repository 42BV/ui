import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { range } from 'lodash';

import { pageOf } from '../../utilities/page/page';

import { EpicPagination } from './EpicPagination';
import { Pagination } from '../Pagination/Pagination';

storiesOf('core/EpicPagination', module)
  .addParameters({ component: EpicPagination })
  .add('default', () => {
    const [pageNumber, setPageNumber] = useState(5);

    const page = pageOf(range(0, 100), pageNumber, 10);

    return (
      <div className="d-flex justify-content-center">
        <Pagination page={page} onChange={setPageNumber} />
      </div>
    );
  });
