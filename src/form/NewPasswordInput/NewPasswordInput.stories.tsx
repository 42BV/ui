import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { FinalForm } from '../story-utils';
import NewPasswordInput, {
  isStrongPassword,
  JarbNewPasswordInput
} from './NewPasswordInput';
import { Addon, Icon, Tooltip, Card } from '../..';

storiesOf('Form/NewPasswordInput', module)
  .add('basic', () => {
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
  })
  .add('icon', () => {
    const [password, setPassword] = useState('');

    return (
      <Card className="m-2">
        <NewPasswordInput
          id="password"
          label="Password"
          placeholder="Please enter your password"
          value={password}
          onChange={setPassword}
          addon={
            <Addon>
              <Icon icon="lock" />
            </Addon>
          }
        />
      </Card>
    );
  })
  .add('without placeholder', () => {
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
  })
  .add('without label', () => {
    const [password, setPassword] = useState('');

    return (
      <Card className="m-2">
        <NewPasswordInput
          placeholder="Please enter your password"
          value={password}
          onChange={setPassword}
        />
      </Card>
    );
  })
  .add('with custom label', () => {
    const [password, setPassword] = useState('');

    return (
      <Card className="m-2">
        <NewPasswordInput
          id="password"
          label={
            <div className="d-flex justify-content-between">
              <span>Password</span>
              <Tooltip
                className="ms-1"
                content="Your password should be secret"
              >
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
  })
  .add('without meter', () => {
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
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbNewPasswordInput
          name="password"
          jarb={{ validator: 'User.password', label: 'Password' }}
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
    );
  });
