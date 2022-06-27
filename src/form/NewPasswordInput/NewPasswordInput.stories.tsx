import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { FinalForm, JarbFormElementDependencies } from '../story-utils';
import { isStrongPassword, JarbNewPasswordInput, NewPasswordInput } from './NewPasswordInput';
import { Alert } from 'reactstrap';
import { Card } from '../../core/Card/Card';
import { Addon } from '../addons/Addon/Addon';
import { Icon } from '../../core/Icon';
import { Tooltip } from '../../core/Tooltip/Tooltip';

storiesOf('Form/NewPasswordInput', module)
  .addParameters({ component: NewPasswordInput })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p>To be able to use NewPasswordInput, you have to add lodash and react-text-mask to your dependencies:</p>
        <code>npm install --save lodash react-text-mask</code>
      </Alert>
      <Story />
    </>
  ))
  .add('basic', () => {
    const [ password, setPassword ] = useState('');

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
    const [ password, setPassword ] = useState('');

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
    const [ password, setPassword ] = useState('');

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
  .add('invisible label', () => {
    const [ password, setPassword ] = useState('');

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
  })
  .add('with custom label', () => {
    const [ password, setPassword ] = useState('');

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
    const [ password, setPassword ] = useState('');

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
      <>
        <JarbFormElementDependencies />
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
      </>
    );
  });
