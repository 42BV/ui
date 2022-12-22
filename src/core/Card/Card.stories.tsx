import React from 'react';
import { CardTitle } from 'reactstrap';

import { Card } from './Card';

export default {
  title: 'core/Card',

  parameters: {
    component: Card
  }
};

const BasicStory = () => {
  return (
    <Card header={<CardTitle>This is a card</CardTitle>} footer="And a footer">
      <p>With some content in it</p>
    </Card>
  );
};

export const Basic = {
  render: BasicStory,
  name: 'basic'
};

const WithoutHeaderStory = () => {
  return (
    <Card footer="And a footer">
      <CardTitle>This is a card</CardTitle>
      <p>With some content in it</p>
    </Card>
  );
};

export const WithoutHeader = {
  render: WithoutHeaderStory,
  name: 'without header'
};

const WithoutFooterStory = () => {
  return (
    <Card header={<CardTitle>This is a card</CardTitle>}>
      <p>With some content in it</p>
    </Card>
  );
};

export const WithoutFooter = {
  render: WithoutFooterStory,
  name: 'without footer'
};
