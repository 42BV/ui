import React from 'react';
import { action } from '@storybook/addon-actions';

import { FieldInput, Input, JarbInput } from './Input';
import {
  FieldFormElementDependencies,
  FinalForm,
  JarbFormElementDependencies
} from '../../story-utils';
import { Alert, InputGroupText } from 'reactstrap';
import { Card } from '../../core/Card/Card';
import { AddonIcon } from '../AddonIcon/AddonIcon';
import { Tooltip } from '../../core/Tooltip/Tooltip';
import { Icon } from '../../core/Icon';
import { Button } from '../../core/Button/Button';

function isSuperman(value: string) {
  return value === 'superman' ? undefined : 'Not "superman"';
}

export default {
  title: 'Form/Input',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p>
            To be able to use Input, you have to add react-text-mask to your
            dependencies:
          </p>
          <code>npm install --save react-text-mask</code>
        </Alert>
        <Story />
      </>
    )
  ],

  parameters: {
    component: Input
  }
};

const BasicStory = () => {
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
};

export const Basic = {
  render: BasicStory,
  name: 'basic'
};

const WithAddonStory = () => {
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
        addon={<AddonIcon icon="face" />}
        color="success"
      />

      <Input
        id="magicNumber"
        label="Magic number"
        placeholder="Please enter the magic number"
        onChange={(value) => action(`onChange: ${value}`)}
        addon={<InputGroupText>Nr</InputGroupText>}
      />

      <Input
        id="magicNumber"
        label="Magic number"
        placeholder="Please enter the magic number"
        onChange={(value) => action(`onChange: ${value}`)}
        addon={<InputGroupText>Try 42</InputGroupText>}
        addonPosition="right"
      />

      <Input
        id="addonButton"
        label="Addon as a button"
        placeholder="Please click on my addon button"
        onChange={(value) => action(`onChange: ${value}`)}
        addon={<Button onClick={() => alert('Yippy')}>Click me</Button>}
      />
    </Card>
  );
};

export const WithAddon = {
  render: WithAddonStory,
  name: 'with addon'
};

const WithoutPlaceholderStory = () => {
  return (
    <Card className="m2">
      <Input
        id="firstName"
        label="First name"
        onChange={(value) => action(`You entered ${value}`)}
      />
    </Card>
  );
};

export const WithoutPlaceholder = {
  render: WithoutPlaceholderStory,
  name: 'without placeholder'
};

const MaskStory = () => {
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
};

export const Mask = {
  render: MaskStory,
  name: 'mask'
};

const InvisibleLabelStory = () => {
  return (
    <Card className="m2">
      <Input
        label="First name"
        hiddenLabel={true}
        placeholder="Please enter your first name"
        onChange={(value) => action(`You entered ${value}`)}
      />
    </Card>
  );
};

export const InvisibleLabel = {
  render: InvisibleLabelStory,
  name: 'invisible label'
};

const WithCustomLabelStory = () => {
  return (
    <Card className="m2">
      <Input
        id="firstName"
        label={
          <div className="d-flex justify-content-between">
            <span>First name</span>
            <Tooltip
              className="ms-1"
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
};

export const WithCustomLabel = {
  render: WithCustomLabelStory,
  name: 'with custom label'
};

const FieldStory = () => {
  return (
    <>
      <FieldFormElementDependencies />
      <FinalForm>
        <FieldInput
          name="firstName"
          jarb={{ validator: 'Hero.name', label: 'First name' }}
          validators={[isSuperman]}
          id="firstName"
          label="First name"
          placeholder="Please enter your first name"
        />
      </FinalForm>
    </>
  );
};

export const Field = {
  render: FieldStory,
  name: 'field'
};

const JarbStory = () => {
  return (
    <>
      <JarbFormElementDependencies />
      <FinalForm>
        <JarbInput
          name="firstName"
          jarb={{ validator: 'Hero.name', label: 'First name' }}
          validators={[isSuperman]}
          id="firstName"
          placeholder="Please enter your first name"
        />
      </FinalForm>
    </>
  );
};

export const Jarb = {
  render: JarbStory,
  name: 'jarb'
};
