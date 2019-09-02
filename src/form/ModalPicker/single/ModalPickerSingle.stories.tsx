import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ModalPickerSingle, { JarbModalPickerSingle } from './ModalPickerSingle';
import { FinalForm, Form } from '../../story-utils';
import { pageWithContentAndExactSize } from '../../../test/utils';
import { userUser, adminUser } from '../../../test/fixtures';
import { User } from '../../../test/types';

storiesOf('Form/ModalPicker/ModalPickerSingle', module)
  .add('basic', () => {
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
          onChange={value => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('with extra add button', () => {
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
          onChange={value => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('without search', () => {
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
          onChange={value => action(`You entered ${value}`)}
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