import { storiesOf } from '@storybook/react';

import { AttributeList } from './AttributeList';
import { AttributeView } from '../AttributeView/AttributeView';
import { Card } from 'reactstrap';

storiesOf('core/AttributeList', module)
  .addParameters({ component: AttributeList })
  .add('basic example', () => {
    return (
      <AttributeList>
        <AttributeView label="Name">42 BV</AttributeView>
        <AttributeView label="City">Zoetermeer</AttributeView>
        <AttributeView label="Country">Netherlands</AttributeView>
      </AttributeList>
    );
  })
  .add('inside card', () => {
    return (
      <Card body className="py-1">
        <AttributeList>
          <AttributeView label="Name">42 BV</AttributeView>
          <AttributeView label="City">Zoetermeer</AttributeView>
          <AttributeView label="Country">Netherlands</AttributeView>
        </AttributeList>
      </Card>
    );
  });
