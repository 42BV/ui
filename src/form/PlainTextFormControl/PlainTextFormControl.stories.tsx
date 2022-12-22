import React from 'react';
import { PlainTextFormControl } from './PlainTextFormControl';
import { Form } from 'reactstrap';

export default {
  title: 'Form/PlainTextFormControl',

  parameters: {
    component: PlainTextFormControl
  }
};

const BasicStory = () => {
  return (
    <Form>
      <PlainTextFormControl label="Organisation">42 BV</PlainTextFormControl>
    </Form>
  );
};

export const Basic = {
  render: BasicStory,
  name: 'basic'
};
