import React, { useState } from 'react';
import {
  FieldFormElementDependencies,
  FinalForm,
  JarbFormElementDependencies
} from '../../story-utils';
import {
  FieldNewPasswordInput,
  isStrongPassword,
  JarbNewPasswordInput,
  NewPasswordInput
} from './NewPasswordInput';
import { Alert } from 'reactstrap';
import { Card } from '../../core/Card/Card';
import { AddonIcon } from '../AddonIcon/AddonIcon';
import { Icon } from '../../core/Icon';
import { Tooltip } from '../../core/Tooltip/Tooltip';

export default {
  title: 'Form/NewPasswordInput',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p>
            To be able to use NewPasswordInput, you have to add lodash and
            react-text-mask to your dependencies:
          </p>
          <code>npm install --save lodash react-text-mask</code>
        </Alert>
        <Story />
      </>
    )
  ],

  parameters: {
    component: NewPasswordInput
  }
};

const BasicStory = () => {
  const [password, setPassword] = useState('');

  return (
    <Card className="m-2">
      <NewPasswordInput
        id="password"
        label="Password"
        placeholder="Please enter your password"
        value={password}
        onChange={setPassword}
      />
    </Card>
  );
};

export const Basic = {
  render: BasicStory,
  name: 'basic'
};

const IconStory = () => {
  const [password, setPassword] = useState('');

  return (
    <Card className="m-2">
      <NewPasswordInput
        id="password"
        label="Password"
        placeholder="Please enter your password"
        value={password}
        onChange={setPassword}
        addon={<AddonIcon icon="lock" />}
      />
    </Card>
  );
};

export const _Icon = {
  render: IconStory,
  name: 'icon'
};

const WithoutPlaceholderStory = () => {
  const [password, setPassword] = useState('');

  return (
    <Card className="m-2">
      <NewPasswordInput
        id="password"
        label="Password"
        value={password}
        onChange={setPassword}
      />
    </Card>
  );
};

export const WithoutPlaceholder = {
  render: WithoutPlaceholderStory,
  name: 'without placeholder'
};

const InvisibleLabelStory = () => {
  const [password, setPassword] = useState('');

  return (
    <Card className="m-2">
      <NewPasswordInput
        label="Password"
        hiddenLabel={true}
        placeholder="Please enter your password"
        value={password}
        onChange={setPassword}
      />
    </Card>
  );
};

export const InvisibleLabel = {
  render: InvisibleLabelStory,
  name: 'invisible label'
};

const WithCustomLabelStory = () => {
  const [password, setPassword] = useState('');

  return (
    <Card className="m-2">
      <NewPasswordInput
        id="password"
        label={
          <div className="d-flex justify-content-between">
            <span>Password</span>
            <Tooltip className="ms-1" content="Your password should be secret">
              <Icon icon="info" />
            </Tooltip>
          </div>
        }
        placeholder="Please enter your password"
        value={password}
        onChange={setPassword}
      />
    </Card>
  );
};

export const WithCustomLabel = {
  render: WithCustomLabelStory,
  name: 'with custom label'
};

const WithoutMeterStory = () => {
  const [password, setPassword] = useState('');

  return (
    <Card className="m-2">
      <NewPasswordInput
        id="password"
        label="Password"
        placeholder="Please enter your password"
        value={password}
        onChange={setPassword}
        showMeter={false}
      />
    </Card>
  );
};

export const WithoutMeter = {
  render: WithoutMeterStory,
  name: 'without meter'
};

const FieldStory = () => {
  return (
    <>
      <FieldFormElementDependencies />
      <FinalForm>
        <FieldNewPasswordInput
          name="password"
          id="password"
          label="password"
          placeholder="Please enter your password"
          validators={[
            isStrongPassword(
              [
                'lowercase',
                'uppercase',
                'number',
                'specialChar',
                'minimumLength',
                'noSpace'
              ],
              10
            )
          ]}
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
        <JarbNewPasswordInput
          name="password"
          jarb={{ validator: 'User.password', label: 'Password' }}
          id="password"
          placeholder="Please enter your password"
          validators={[
            isStrongPassword(
              [
                'lowercase',
                'uppercase',
                'number',
                'specialChar',
                'minimumLength',
                'noSpace'
              ],
              10
            )
          ]}
        />
      </FinalForm>
    </>
  );
};

export const Jarb = {
  render: JarbStory,
  name: 'jarb'
};
