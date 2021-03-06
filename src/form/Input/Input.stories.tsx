import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Input, { JarbInput } from './Input';
import { FinalForm } from '../story-utils';
import { Tooltip, Icon, Addon, AddonIcon, AddonButton, Card } from '../..';

function isSuperman(value: string) {
  return value === 'superman' ? undefined : 'Not "superman"';
}

storiesOf('Form/Input', module)
  .add('basic', () => {
    return (
      <Card className="m2">
        <Input
          id="firstName"
          label="First name"
          placeholder="Please enter your first name"
          onChange={(value) => action(`You entered ${value}`)}
        />
      </Card>
    );
  })
  .add('with addon', () => {
    return (
      <Card className="m2">
        <Input
          id="firstName"
          label="First name"
          placeholder="Please enter your first name"
          onChange={(value) => action(`onChange: ${value}`)}
          addon={<AddonIcon icon="face" />}
        />

        <Input
          id="lastName"
          label="Last name"
          placeholder="Please enter your last name"
          onChange={(value) => action(`onChange: ${value}`)}
          addon={<AddonIcon position="right" icon="face" />}
          color="success"
        />

        <Input
          id="magicNumber"
          label="Magic number"
          placeholder="Please enter the magic number"
          onChange={(value) => action(`onChange: ${value}`)}
          addon={<Addon>Try 42</Addon>}
        />

        <Input
          id="addonButton"
          label="Addon as a button"
          placeholder="Please click on my addon button"
          onChange={(value) => action(`onChange: ${value}`)}
          addon={
            <AddonButton onClick={() => alert('Yippy')} position="right">
              Click me
            </AddonButton>
          }
        />
      </Card>
    );
  })
  .add('without placeholder', () => {
    return (
      <Card className="m2">
        <Input
          id="firstName"
          label="First name"
          onChange={(value) => action(`You entered ${value}`)}
        />
      </Card>
    );
  })
  .add('mask', () => {
    return (
      <Card className="m2">
        <Input
          id="zipcode"
          label="Zipcode"
          placeholder="Please enter your zipcode"
          onChange={(value) => action(`You entered ${value}`)}
          mask={[/[1-9]/, /[1-9]/, /[1-9]/, /[1-9]/, ' ', /[A-z]/, /[A-z]/]}
        />
        <p>
          Look
          <a href="https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md#mask">
            here
          </a>
          for more example on how to use mask
        </p>
      </Card>
    );
  })
  .add('without label', () => {
    return (
      <Card className="m2">
        <Input
          placeholder="Please enter your first name"
          onChange={(value) => action(`You entered ${value}`)}
        />
      </Card>
    );
  })
  .add('with custom label', () => {
    return (
      <Card className="m2">
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
          onChange={(value) => action(`You entered ${value}`)}
        />
      </Card>
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
