import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import ModalPickerSingle, { JarbModalPickerSingle } from './ModalPickerSingle';
import { FinalForm, Form } from '../../story-utils';
import { pageWithContentAndExactSize } from '../../../test/utils';
import { adminUser, userUser } from '../../../test/fixtures';
import { User } from '../../../test/types';
import { Icon, Tooltip } from '../../..';
import Avatar from '../../../core/Avatar/Avatar';
import { ListGroup, ListGroupItem } from 'reactstrap';

storiesOf('Form/ModalPicker/ModalPickerSingle', module)
  .add('basic', () => {
    const [value, setValue] = useState<User | undefined>(undefined);

    return (
      <Form>
        <ModalPickerSingle
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          value={value}
          onChange={setValue}
        />
      </Form>
    );
  })
  .add('with extra add button', () => {
    const [value, setValue] = useState<User | undefined>(undefined);

    return (
      <Form>
        <ModalPickerSingle<User>
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser]))
          }
          addButton={{
            label: 'Create friend',
            onClick: () => {
              // Just a fake implementation of how this could work.
              // In real life you probably want to pop a modal window
              // to create the friend.
              return new Promise(resolve => {
                setTimeout(() => {
                  resolve(adminUser);
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
    const [value, setValue] = useState<User | undefined | null>(undefined);

    return (
      <Form>
        <ModalPickerSingle
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={false}
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser]))
          }
          value={value}
          onChange={setValue}
        />
      </Form>
    );
  })
  .add('custom optionIsEqual', () => {
    const [value, setValue] = useState<User | undefined>(userUser);

    return (
      <Form>
        <ModalPickerSingle
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          optionForValue={(user: User) => user.email}
          isOptionEqual={(a: User, b: User) => a.id === b.id}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          value={value}
          onChange={setValue}
        />
      </Form>
    );
  })
  .add('custom renderOptions', () => {
    const [value, setValue] = useState<User | undefined>();

    return (
      <Form>
        <ModalPickerSingle<User>
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          optionForValue={(user: User) => user.email}
          renderOptions={options => (
            <ListGroup>
              {options.map(({ option, isSelected, toggle }) => (
                <ListGroupItem
                  key={option.email}
                  onClick={toggle}
                  className="d-flex justify-content-between align-items-center clickable"
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
          isOptionEqual={(a: User, b: User) => a.id === b.id}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          value={value}
          onChange={setValue}
        />
      </Form>
    );
  })
  .add('without label', () => {
    const [value, setValue] = useState<User | undefined>(undefined);

    return (
      <Form>
        <ModalPickerSingle
          id="bestFriend"
          placeholder="Select your best friend"
          canSearch={true}
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          value={value}
          onChange={setValue}
        />
      </Form>
    );
  })
  .add('with custom label', () => {
    const [value, setValue] = useState<User | undefined>(undefined);

    return (
      <Form>
        <ModalPickerSingle
          id="bestFriend"
          label={
            <div className="d-flex justify-content-between">
              <span>Best friend</span>
              <Tooltip className="ml-1" content="BFF for life!">
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Select your best friend"
          canSearch={true}
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          value={value}
          onChange={setValue}
        />
      </Form>
    );
  })
  .add('button alignment', () => {
    const [value, setValue] = useState<User | undefined>(undefined);

    return (
      <Form>
        <ModalPickerSingle
          id="bestFriend"
          label="Default"
          placeholder="Select your best friend"
          canSearch={true}
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          value={value}
          onChange={setValue}
          alignButton="default"
        />
        <ModalPickerSingle
          id="bestFriend"
          label="Button on the left"
          placeholder="Select your best friend"
          canSearch={true}
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          value={value}
          onChange={setValue}
          alignButton="left"
        />
        <ModalPickerSingle
          id="bestFriend"
          label="Button on the right"
          placeholder="Select your best friend"
          canSearch={true}
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          value={value}
          onChange={setValue}
          alignButton="right"
        />
      </Form>
    );
  })
  .add('display values', () => {
    const [value, setValue] = useState<User | undefined>(undefined);

    return (
      <Form>
        <ModalPickerSingle
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          value={value}
          onChange={setValue}
          displayValues={(user?: User) => {
            return user ? (
              <>
                {user.roles.some(role => role === 'ADMIN') ? (
                  <Icon icon="supervised_user_circle" />
                ) : (
                  <Icon icon="supervisor_account" />
                )}
                {user.firstName}
                <b>{user.lastName}</b>
              </>
            ) : null;
          }}
        />
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbModalPickerSingle
          id="bestFriend"
          name="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={false}
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser]))
          }
          jarb={{
            validator: 'Hero.name',
            label: 'Best friend'
          }}
        />
      </FinalForm>
    );
  });
