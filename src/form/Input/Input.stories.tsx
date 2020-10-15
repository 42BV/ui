import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Input, { JarbInput } from './Input';
import { Form, FinalForm } from '../story-utils';
import { Tooltip, Icon, Button } from '../..';

function isSuperman(value: string) {
  return value === 'superman' ? undefined : 'Not "superman"';
}

storiesOf('Form|Input', module)
  .add('basic', () => {
    return (
      <Form>
        <Input
          id="firstName"
          label="First name"
          placeholder="Please enter your first name"
          onChange={value => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('icon', () => {
    return (
      <Form>
        <Input
          id="firstName"
          label="First name"
          placeholder="Please enter your first name"
          onChange={value => action(`onChange: ${value}`)}
          addon={{
            icon: 'face',
            position: 'left'
          }}
        />
      </Form>
    );
  })
  .add('without placeholder', () => {
    return (
      <Form>
        <Input
          id="firstName"
          label="First name"
          onChange={value => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('mask', () => {
    return (
      <Form>
        <Input
          id="zipcode"
          label="Zipcode"
          placeholder="Please enter your zipcode"
          onChange={value => action(`You entered ${value}`)}
          mask={[/[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/, ' ', /[A-z]/, /[A-z]/]}
        />
        <p>
          Look
          <a href="https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md#mask">
            here
          </a>
          for more example on how to use mask
        </p>
      </Form>
    );
  })
  .add('without label', () => {
    return (
      <Form>
        <Input
          placeholder="Please enter your first name"
          onChange={value => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('with custom label', () => {
    return (
      <Form>
        <Input
          id="firstName"
          label={
            <div className="d-flex justify-content-between">
              <span>First name</span>
              <Tooltip
                className="ml-1"
                content="Your first name is on your birth certificate"
              >
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Please enter your first name"
          onChange={value => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('disabled', () => {
    const [isDisabled, setDisabled] = useState<boolean>(true);

    return (
      <Form>
        <Input
          id="firstName"
          label={
            <div className="d-flex justify-content-between">
              <span>First name</span>
              <Tooltip
                className="ml-1"
                content="Your first name is on your birth certificate"
              >
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Please enter your first name"
          disabled={isDisabled}
          onChange={value => action(`You entered ${value}`)}
        />

        <Button onClick={() => setDisabled(!isDisabled)}>
          Toggle disabled state
        </Button>
      </Form>
    );
  })
  .add('readOnly', () => {
    const [isReadOnly, setReadOnly] = useState<boolean>(true);

    return (
      <Form>
        <Input
          id="firstName"
          label={
            <div className="d-flex justify-content-between">
              <span>First name</span>
              <Tooltip
                className="ml-1"
                content="Your first name is on your birth certificate"
              >
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Please enter your first name"
          readOnly={isReadOnly}
          onChange={value => action(`You entered ${value}`)}
        />

        <Button onClick={() => setReadOnly(!isReadOnly)}>
          Toggle readOnly state
        </Button>
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbInput
          name="firstName"
          jarb={{ validator: 'Hero.name', label: 'First name' }}
          validators={[isSuperman]}
          id="firstName"
          label="First name"
          placeholder="Please enter your first name"
        />
      </FinalForm>
    );
  });

export const _ = '';
