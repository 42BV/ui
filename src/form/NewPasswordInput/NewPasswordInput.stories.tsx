import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { FinalForm, Form } from '../story-utils';
import NewPasswordInput, {
  isStrongPassword,
  JarbNewPasswordInput
} from './NewPasswordInput';
import { Icon, Tooltip } from '../../index';

storiesOf('Form/NewPasswordInput', module)
  .add('basic', () => {
    const [password, setPassword] = useState('');

    return (
      <Form>
        <NewPasswordInput
          id="password"
          label="Password"
          placeholder="Please enter your password"
          value={password}
          onChange={setPassword}
        />
      </Form>
    );
  })
  .add('icon', () => {
    const [password, setPassword] = useState('');

    return (
      <Form>
        <NewPasswordInput
          id="password"
          label="Password"
          placeholder="Please enter your password"
          value={password}
          onChange={setPassword}
          addon={{
            icon: 'lock',
            position: 'left'
          }}
        />
      </Form>
    );
  })
  .add('without placeholder', () => {
    const [password, setPassword] = useState('');

    return (
      <Form>
        <NewPasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
        />
      </Form>
    );
  })
  .add('without label', () => {
    const [password, setPassword] = useState('');

    return (
      <Form>
        <NewPasswordInput
          placeholder="Please enter your password"
          value={password}
          onChange={setPassword}
        />
      </Form>
    );
  })
  .add('with custom label', () => {
    const [password, setPassword] = useState('');

    return (
      <Form>
        <NewPasswordInput
          id="password"
          label={
            <div className="d-flex justify-content-between">
              <span>Password</span>
              <Tooltip
                className="ml-1"
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
      </Form>
    );
  })
  .add('without meter', () => {
    const [password, setPassword] = useState('');

    return (
      <Form>
        <NewPasswordInput
          id="password"
          label="Password"
          placeholder="Please enter your password"
          value={password}
          onChange={setPassword}
          showMeter={false}
        />
      </Form>
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
