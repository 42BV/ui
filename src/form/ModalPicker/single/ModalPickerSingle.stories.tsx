import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import ModalPickerSingle, { JarbModalPickerSingle } from './ModalPickerSingle';
import { FinalForm, Form } from '../../story-utils';
import { pageWithContentAndExactSize } from '../../../test/utils';
import { userUser, adminUser } from '../../../test/fixtures';
import { User } from '../../../test/types';

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
