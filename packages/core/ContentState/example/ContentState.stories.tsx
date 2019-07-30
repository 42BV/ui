import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from 'reactstrap';

import ContentState from '../src/ContentState';

storiesOf('core/ContentState', module)
  .addParameters({ component: ContentState })
  .add('empty', () => {
    return (
      <ContentState
        mode="empty"
        title="Accounts"
        subTitle="There are no accounts yet"
      />
    );
  })
  .add('error', () => {
    return (
      <ContentState
        mode="error"
        title="Bikes"
        subTitle="All bikes are destroyed"
      />
    );
  })
  .add('no-results', () => {
    return (
      <ContentState
        mode="no-results"
        title="Persons"
        subTitle="No persons found matching criteria"
      />
    );
  })
  .add('with children', () => {
    return (
      <ContentState
        mode="empty"
        title="Bikes"
        subTitle="There are no bikes yet"
      >
        <Button color="info">Add bike</Button>
      </ContentState>
    );
  });

export const _ = '';
