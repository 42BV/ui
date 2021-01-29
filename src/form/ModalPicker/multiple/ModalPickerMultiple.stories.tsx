import React, { Fragment, useState } from 'react';
import { storiesOf } from '@storybook/react';

import { pageWithContentAndExactSize } from '../../../test/utils';
import {
  adminUser,
  coordinatorUser,
  pageOfUsers,
  userUser
} from '../../../test/fixtures';
import { User } from '../../../test/types';

import ModalPickerMultiple, {
  JarbModalPickerMultiple
} from './ModalPickerMultiple';

import {
  FinalForm,
  Form,
  IsOptionEqualInfo,
  KeyForOptionInfo,
  nonExistingProvince,
  Province,
  provinceFetcher,
  provinces,
  ReloadOptionsInfo,
  resolveAfter
} from '../../story-utils';
import { Icon, Toggle, Tooltip } from '../../..';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Avatar from '../../../core/Avatar/Avatar';
import classNames from 'classnames';

storiesOf('Form/ModalPicker/ModalPickerMultiple', module)
  .add('predefined options', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Form>
        <ModalPickerMultiple
          id="provinces"
          label="Provinces"
          placeholder="Please select your provinces"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
        />

        {value ? (
          <p>
            Your chosen provinces are:{' '}
            {value.map((province) => province.label).join(', ')}
          </p>
        ) : null}
      </Form>
    );
  })
  .add('async options', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Form>
        <ModalPickerMultiple
          id="provinces"
          label="Provinces"
          placeholder="Please select your provinces"
          options={provinceFetcher}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
        />

        {value ? (
          <p>
            Your chosen provinces are:{' '}
            {value.map((province) => province.label).join(', ')}
          </p>
        ) : null}
      </Form>
    );
  })
  .add('disabled options', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Form>
        <ModalPickerMultiple
          id="provinces"
          label="Provinces"
          placeholder="Please select your provinces"
          options={provinces()}
          labelForOption={(province) => province.label}
          isOptionEnabled={(option) => !option.label.startsWith('Z')}
          value={value}
          onChange={setValue}
        />

        {value ? (
          <p>
            Your chosen provinces are:{' '}
            {value.map((province) => province.label).join(', ')}
          </p>
        ) : null}
      </Form>
    );
  })
  .add('custom isOptionEqual', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      provinces()[0]
    ]);

    return (
      <Form>
        <ModalPickerMultiple
          id="provinces"
          label="Provinces"
          placeholder="Please select your provinces"
          options={provinces()}
          labelForOption={(province) => province.label}
          isOptionEqual={(a, b) => a.value === b.value}
          value={value}
          onChange={setValue}
        />

        {value ? (
          <p>
            Your chosen provinces are:{' '}
            {value.map((province) => province.label).join(', ')}
          </p>
        ) : null}

        <IsOptionEqualInfo />
      </Form>
    );
  })
  .add('custom keyForOption', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      provinces()[0]
    ]);

    return (
      <Form>
        <ModalPickerMultiple
          id="provinces"
          label="Provinces"
          placeholder="Please select your provinces"
          options={provinces()}
          labelForOption={(province) => province.label}
          keyForOption={(province) => province.value}
          value={value}
          onChange={setValue}
        />

        {value ? (
          <p>
            Your chosen provinces are:{' '}
            {value.map((province) => province.label).join(', ')}
          </p>
        ) : null}

        <KeyForOptionInfo />
      </Form>
    );
  })
  .add('using reloadOptions', () => {
    const [limitToNorthern, setLimitToNorthern] = useState(false);
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Form>
        <p>
          Limit to northern provinces
          <Toggle
            className="ml-2"
            color="primary"
            value={limitToNorthern}
            onChange={() => setLimitToNorthern(!limitToNorthern)}
          />
        </p>

        <ModalPickerMultiple
          id="provinces"
          label="Provinces"
          placeholder="Please select your provinces"
          options={provinces().filter((option) =>
            limitToNorthern ? option.north : true
          )}
          labelForOption={(option) => option.label}
          value={value}
          onChange={setValue}
          reloadOptions={limitToNorthern}
        />

        {value ? (
          <p>
            Your chosen provinces are:{' '}
            {value.map((province) => province.label).join(',')}
          </p>
        ) : null}

        <ReloadOptionsInfo />
      </Form>
    );
  })
  .add('using reloadOptions', () => {
    const [limitToNorthern, setLimitToNorthern] = useState(false);
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Form>
        <p>
          Limit to northern provinces
          <Toggle
            className="ml-2"
            color="primary"
            value={limitToNorthern}
            onChange={() => setLimitToNorthern(!limitToNorthern)}
          />
        </p>

        <ModalPickerMultiple
          id="provinces"
          label="Provinces"
          placeholder="Please select your provinces"
          options={provinces().filter((option) =>
            limitToNorthern ? option.north : true
          )}
          labelForOption={(option) => option.label}
          value={value}
          onChange={setValue}
          reloadOptions={limitToNorthern}
        />

        {value ? (
          <p>
            Your chosen provinces are:{' '}
            {value.map((province) => province.label).join(',')}
          </p>
        ) : null}

        <ReloadOptionsInfo />
      </Form>
    );
  })
  .add('with extra add button', () => {
    const [value, setValue] = useState<User[] | undefined>([]);

    return (
      <Form>
        <ModalPickerMultiple<User>
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          labelForOption={(user: User) => user.email}
          options={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser()]))
          }
          addButton={{
            label: 'Create friend',
            onClick: () => {
              // Just a fake implementation of how this could work.
              // In real life you probably want to pop a modal window
              // to create the friend.
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve(adminUser());
                }, 1000);
              });
            }
          }}
          value={value}
          onChange={setValue}
        />
      </Form>
    );
  })
  .add('without search', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Form>
        <ModalPickerMultiple
          id="provinces"
          label="Provinces"
          placeholder="Please select your provinces"
          options={provinces()}
          labelForOption={(province) => province.label}
          canSearch={false}
          value={value}
          onChange={setValue}
        />
      </Form>
    );
  })
  .add('custom renderOptions', () => {
    const [value, setValue] = useState<User[] | undefined>([]);

    return (
      <Form>
        <ModalPickerMultiple<User>
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          options={[userUser(), adminUser(), coordinatorUser()]}
          labelForOption={(user: User) => user.email}
          isOptionEnabled={(user) => user.email !== 'admin@42.nl'}
          renderOptions={(options) => (
            <ListGroup>
              {options.map(({ option, isSelected, toggle, enabled }) => (
                <ListGroupItem
                  key={option.email}
                  onClick={toggle}
                  className={classNames(
                    'd-flex justify-content-between align-items-center',
                    { clickable: enabled, 'bg-light': !enabled }
                  )}
                >
                  <span>
                    <Avatar
                      src="https://www.placecage.com/100/100"
                      alt={option.email}
                    />
                    {option.email}
                  </span>
                  {isSelected ? <Icon icon="check" color="primary" /> : null}
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
          value={value}
          onChange={setValue}
        />
      </Form>
    );
  })
  .add('custom renderValue', () => {
    const [value, setValue] = useState<User[] | undefined>([]);

    return (
      <Form>
        <ModalPickerMultiple<User>
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          options={[userUser(), adminUser(), coordinatorUser()]}
          labelForOption={(user: User) => user.email}
          value={value}
          onChange={(value) => setValue(value)}
          renderValue={(users) => {
            return users ? (
              <>
                {users.map((user, index) => (
                  <Fragment key={user.id}>
                    {index > 0 ? ', ' : ''}
                    {user.roles.some((role) => role === 'ADMIN') ? (
                      <Icon icon="supervised_user_circle" />
                    ) : (
                      <Icon icon="supervisor_account" />
                    )}
                    {user.firstName}
                    <b>{user.lastName}</b>
                  </Fragment>
                ))}
              </>
            ) : null;
          }}
        />
      </Form>
    );
  })
  .add('button alignment', () => {
    const [value, setValue] = useState<User[] | undefined>([]);

    return (
      <Form>
        <ModalPickerMultiple<User>
          id="bestFriend"
          label="Default"
          placeholder="Select your best friend"
          canSearch={true}
          options={() => resolveAfter(pageOfUsers())}
          labelForOption={(user: User) => user.email}
          value={value}
          onChange={setValue}
        />
        <ModalPickerMultiple<User>
          id="bestFriend"
          label="Button on the left"
          placeholder="Select your best friend"
          canSearch={true}
          options={() => resolveAfter(pageOfUsers())}
          labelForOption={(user: User) => user.email}
          value={value}
          onChange={setValue}
          alignButton="left"
        />
        <ModalPickerMultiple<User>
          id="bestFriend"
          label="Button on the right"
          placeholder="Select your best friend"
          canSearch={true}
          options={() => resolveAfter(pageOfUsers())}
          labelForOption={(user: User) => user.email}
          value={value}
          onChange={setValue}
          alignButton="right"
        />
      </Form>
    );
  })
  .add('labels', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Form>
        <h3>Without label</h3>

        <ModalPickerMultiple
          id="provinces"
          placeholder="Please select your provinces"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
        />

        {value ? (
          <p>
            Your chosen provinces are:{' '}
            {value.map((province) => province.label).join(', ')}
          </p>
        ) : null}

        <hr />

        <h3>Custom label</h3>

        <ModalPickerMultiple
          id="provinces"
          label={
            <div className="d-flex justify-content-between">
              <span>Friends</span>
              <Tooltip
                className="ml-1"
                content="It is nice to have lots of friends"
              >
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Please select your provinces"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
        />

        {value ? (
          <p>
            Your chosen provinces are:{' '}
            {value.map((province) => province.label).join(', ')}
          </p>
        ) : null}
      </Form>
    );
  })
  .add('with icon', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Form>
        <h3>Without icon</h3>

        <ModalPickerMultiple
          id="provinces"
          placeholder="Please select your provinces"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
        />

        {value ? (
          <p>
            Your chosen provinces are:{' '}
            {value.map((province) => province.label).join(', ')}
          </p>
        ) : null}

        <hr />

        <h3>With icon</h3>

        <ModalPickerMultiple
          id="provinces"
          placeholder="Please select your provinces"
          icon="ballot"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
        />

        {value ? (
          <p>
            Your chosen provinces are:{' '}
            {value.map((province) => province.label).join(', ')}
          </p>
        ) : null}
      </Form>
    );
  })
  .add('without clear button', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Form>
        <ModalPickerMultiple
          id="provinces"
          placeholder="Please select your provinces"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
          canClear={false}
        />
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbModalPickerMultiple
          id="provinces"
          name="provinces"
          label="Provinces"
          placeholder="Please select your provinces"
          options={provinceFetcher}
          labelForOption={(province) => province.label}
          jarb={{
            validator: 'User.provinces',
            label: 'Provinces'
          }}
        />
      </FinalForm>
    );
  });
