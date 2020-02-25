import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Textarea, { JarbTextarea } from './Textarea';
import { FinalForm, Form } from '../story-utils';

storiesOf('Form|Textarea', module)
  .add('basic', () => {
    return (
      <Form>
        <Textarea
          id="description"
          label="Description"
          placeholder="Please add a description"
          onChange={value => action(`onChange: ${value}`)}
        />
      </Form>
    );
  })
  .add('without placeholder', () => {
    return (
      <Form>
        <Textarea
          id="description"
          label="Description"
          onChange={value => action(`onChange: ${value}`)}
        />
      </Form>
    );
  })
  .add('without label', () => {
    return (
      <Form>
        <Textarea
          id="description"
          placeholder="Please add a description"
          onChange={value => action(`onChange: ${value}`)}
        />
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbTextarea
          id="description"
          name="description"
          label="Description"
          placeholder="Please add a description"
          jarb={{
            validator: 'Hero.description',
            label: 'Description'
          }}
        />
      </FinalForm>
    );
  });
