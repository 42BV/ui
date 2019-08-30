import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { pageWithContentAndExactSize } from '../../../test/utils';
import { userUser, adminUser } from '../../../test/fixtures';
import { User } from '../../../test/types';

import ModalPickerMultiple, {
  JarbModalPickerMultiple
} from './ModalPickerMultiple';

import { FinalForm, Form } from '../../story-utils';

storiesOf('Form|ModalPicker/ModalPickerMultiple', module)
  .add('default', () => {
    return (
      <Form>
        <ModalPickerMultiple<User>
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          fetchOptions={() =>
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          optionForValue={(user: User) => user.email}
          onChange={value => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('with extra add button', () => {
    return (
      <Form>
        <ModalPickerMultiple<User>
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
          onChange={value => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('without search', () => {
    return (
      <Form>
        <ModalPickerMultiple<User>
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={false}
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
          onChange={value => action(`You entered ${value}`)}
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
            Promise.resolve(pageWithContentAndExactSize([userUser, adminUser]))
          }
          jarb={{
            validator: 'Hero.name',
            label: 'Best friend'
          }}
        />
      </FinalForm>
    );
  });
