import { storiesOf } from '@storybook/react';
import { CardTitle } from 'reactstrap';

import { Card } from './Card';

storiesOf('core/Card', module)
  .addParameters({ component: Card })
  .add('basic', () => {
    return (
      <Card
        header={<CardTitle>This is a card</CardTitle>}
        footer="And a footer"
      >
        <p>With some content in it</p>
      </Card>
    );
  })
  .add('without header', () => {
    return (
      <Card footer="And a footer">
        <CardTitle>This is a card</CardTitle>
        <p>With some content in it</p>
      </Card>
    );
  })
  .add('without footer', () => {
    return (
      <Card header={<CardTitle>This is a card</CardTitle>}>
        <p>With some content in it</p>
      </Card>
    );
  });
