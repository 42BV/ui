import React from 'react';
import { storiesOf } from '@storybook/react';
import { PlainTextFormControl } from './PlainTextFormControl';
import { Form } from 'reactstrap';

storiesOf('Form/PlainTextFormControl', module).add('basic', () => {
  return (
    <Form>
      <PlainTextFormControl label="Organisation">42 BV</PlainTextFormControl>
    </Form>
  );
});
