import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { pageWithContentAndExactSize } from '../../../test/utils';
import { adminUser, userUser } from '../../../test/fixtures';
import { User } from '../../../test/types';

import ModalPickerMultiple, {
  JarbModalPickerMultiple
} from './ModalPickerMultiple';

import { FinalForm, Form } from '../../story-utils';
import { Icon, Tooltip } from '../../..';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Avatar from '../../../core/Avatar/Avatar';

storiesOf('Form/ModalPicker/ModalPickerMultiple', module)
  .add('default', () => {
    const [value, setValue] = useState<User[] | undefined>([]);

    return (
      <Form>
        <ModalPickerMultiple<User>
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          fetchOptions={() =>
            Promise.resolve(
              pageWithContentAndExactSize([userUser(), adminUser()])
            )
          }
          optionForValue={(user: User) => user.email}
          value={value}
          onChange={setValue}
        />
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
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
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
    const [value, setValue] = useState<User[] | undefined>([]);

    return (
      <Form>
        <ModalPickerMultiple<User>
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={false}
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
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
  .add('custom isOptionEqual', () => {
    const [value, setValue] = useState<User[] | undefined>([userUser()]);

    return (
      <Form>
        <ModalPickerMultiple<User>
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          fetchOptions={() =>
            Promise.resolve(
              pageWithContentAndExactSize([userUser(), adminUser()])
            )
          }
          optionForValue={(user: User) => user.email}
          isOptionEqual={(a: User, b: User) => a.id === b.id}
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
          fetchOptions={() =>
            Promise.resolve(
              pageWithContentAndExactSize([userUser(), adminUser()])
            )
          }
          isOptionEqual={(a, b) => a.id === b.id}
          optionForValue={(user: User) => user.email}
          renderOptions={(options) => (
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
          value={value}
          onChange={setValue}
        />
      </Form>
    );
  })
  .add('without label', () => {
    const [value, setValue] = useState<User[] | undefined>([]);

    return (
      <Form>
        <ModalPickerMultiple<User>
          id="bestFriend"
          placeholder="Select your best friend"
          canSearch={true}
          fetchOptions={() =>
            Promise.resolve(
              pageWithContentAndExactSize([userUser(), adminUser()])
            )
          }
          optionForValue={(user: User) => user.email}
          value={value}
          onChange={setValue}
        />
      </Form>
    );
  })
  .add('with custom label', () => {
    const [value, setValue] = useState<User[] | undefined>([]);

    return (
      <Form>
        <ModalPickerMultiple<User>
          id="bestFriend"
          label={
            <div className="d-flex justify-content-between">
              <span>Best friend</span>
              <Tooltip
                className="ml-1"
                content="Your best friend is the one you trust the most"
              >
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Select your best friend"
          canSearch={true}
          fetchOptions={() =>
            Promise.resolve(
              pageWithContentAndExactSize([userUser(), adminUser()])
            )
          }
          optionForValue={(user: User) => user.email}
          value={value}
          onChange={setValue}
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
          fetchOptions={() =>
            Promise.resolve(
              pageWithContentAndExactSize([userUser(), adminUser()])
            )
          }
          optionForValue={(user: User) => user.email}
          value={value}
          onChange={setValue}
        />
        <ModalPickerMultiple<User>
          id="bestFriend"
          label="Button on the left"
          placeholder="Select your best friend"
          canSearch={true}
          fetchOptions={() =>
            Promise.resolve(
              pageWithContentAndExactSize([userUser(), adminUser()])
            )
          }
          optionForValue={(user: User) => user.email}
          value={value}
          onChange={setValue}
          alignButton="left"
        />
        <ModalPickerMultiple<User>
          id="bestFriend"
          label="Button on the right"
          placeholder="Select your best friend"
          canSearch={true}
          fetchOptions={() =>
            Promise.resolve(
              pageWithContentAndExactSize([userUser(), adminUser()])
            )
          }
          optionForValue={(user: User) => user.email}
          value={value}
          onChange={setValue}
          alignButton="right"
        />
      </Form>
    );
  })
  .add('display values', () => {
    const [value, setValue] = useState<User[] | undefined>([]);

    return (
      <Form>
        <ModalPickerMultiple<User>
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          fetchOptions={() =>
            Promise.resolve(
              pageWithContentAndExactSize([userUser(), adminUser()])
            )
          }
          optionForValue={(user: User) => user.email}
          value={value}
          onChange={setValue}
          displayValues={(users) => {
            return users ? (
              <>
                {users.map((user, index) => (
                  <>
                    {index > 0 ? ', ' : ''}
                    {user.roles.some((role) => role === 'ADMIN') ? (
                      <Icon icon="supervised_user_circle" />
                    ) : (
                      <Icon icon="supervisor_account" />
                    )}
                    {user.firstName}
                    <b>{user.lastName}</b>
                  </>
                ))}
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
        <JarbModalPickerMultiple
          id="bestFriend"
          name="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          optionForValue={(user: User) => user.email}
          fetchOptions={() =>
            Promise.resolve(
              pageWithContentAndExactSize([userUser(), adminUser()])
            )
          }
          jarb={{
            validator: 'Hero.name',
            label: 'Best friend'
          }}
        />
      </FinalForm>
    );
  });
