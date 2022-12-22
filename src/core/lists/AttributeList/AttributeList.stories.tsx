import React from 'react';

import { AttributeList } from './AttributeList';
import { AttributeView } from '../AttributeView/AttributeView';
import { Card } from 'reactstrap';

export default {
  title: 'core/AttributeList',

  parameters: {
    component: AttributeList
  }
};

const BasicExampleStory = () => {
  return (
    <AttributeList>
      <AttributeView label="Name">42 BV</AttributeView>
      <AttributeView label="City">Zoetermeer</AttributeView>
      <AttributeView label="Country">Netherlands</AttributeView>
    </AttributeList>
  );
};

export const BasicExample = {
  render: BasicExampleStory,
  name: 'basic example'
};

const InsideCardStory = () => {
  return (
    <Card body className="py-1">
      <AttributeList>
        <AttributeView label="Name">42 BV</AttributeView>
        <AttributeView label="City">Zoetermeer</AttributeView>
        <AttributeView label="Country">Netherlands</AttributeView>
      </AttributeList>
    </Card>
  );
};

export const InsideCard = {
  render: InsideCardStory,
  name: 'inside card'
};
