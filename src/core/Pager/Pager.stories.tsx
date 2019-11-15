import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import Pager from './Pager';
import { pageOf } from '../../utilities/page/page';

storiesOf('core|Pager', module)
  .addParameters({ component: Pager })
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
