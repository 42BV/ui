import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Toggle, { FormToggle, JarbFormToggle } from './Toggle';
import { Form, FinalForm } from '../story-utils';

storiesOf('Form|Toggle', module)
  .add('basic', () => {
    return (
      <div className="text-center">
        <Toggle
          color="primary"
          onChange={action('onChange')}
          onBlur={action('onBlur')}
        />
        primary <br />
        <Toggle
          color="secondary"
          onChange={action('onChange')}
          onBlur={action('onBlur')}
        />
        secondary <br />
        <Toggle
          color="info"
          onChange={action('onChange')}
          onBlur={action('onBlur')}
        />
        info <br />
        <Toggle
          color="success"
          onChange={action('onChange')}
          onBlur={action('onBlur')}
        />
        success <br />
        <Toggle
          color="warning"
          onChange={action('onChange')}
          onBlur={action('onBlur')}
        />
        warning <br />
        <Toggle
          color="danger"
          onChange={action('onChange')}
          onBlur={action('onBlur')}
        />
        danger <br />
        <Toggle
          color="light"
          onChange={action('onChange')}
          onBlur={action('onBlur')}
        />
        light <br />
        <Toggle
          color="dark"
          onChange={action('onChange')}
          onBlur={action('onBlur')}
        />
        dark
      </div>
    );
  })
  .add('form', () => {
    return (
      <Form>
        <FormToggle
          id="agree"
          label="Agree"
          toggleColor="primary"
          onChange={value => action(`onChange: ${value}`)}
        />
      </Form>
    );
  })
  .add('without label', () => {
    return (
      <Form>
        <FormToggle
          id="agree"
          toggleColor="primary"
          onChange={value => action(`onChange: ${value}`)}
        />
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbFormToggle
          id="agree"
          name="agree"
          label="Agree"
          toggleColor="primary"
          jarb={{
            validator: 'Hero.agree',
            label: 'Agree'
          }}
        />
      </FinalForm>
    );
  });
