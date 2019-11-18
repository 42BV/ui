import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { pageWithContentAndExactSize, pageWithContent } from '../../test/utils';
import { userUser, adminUser, randomUser } from '../../test/fixtures';
import { User } from '../../test/types';

import ValuePicker, { JarbValuePicker } from './ValuePicker';

import { FinalForm, Form } from '../story-utils';
import Button from '../../core/Button/Button';

const small = Promise.resolve(
  pageWithContentAndExactSize([userUser, adminUser])
);

const large = Promise.resolve(
  pageWithContent([
    userUser,
    adminUser,
    randomUser(),
    randomUser(),
    randomUser(),
    randomUser(),
    randomUser(),
    randomUser(),
    randomUser(),
    randomUser(),
    randomUser(),
    randomUser(),
    randomUser()
  ])
);

storiesOf('Form|ValuePicker/multiple', module)
  .addParameters({ component: ValuePicker })
  .add('basic', () => {
    const [value, setValue] = useState<User[] | undefined>(undefined);

    const [size, setSize] = useState('small');

    const promise = size === 'small' ? small : large;

    return (
      <Form>
        <ValuePicker<User>
          multiple={true}
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          fetchOptions={() => promise}
          optionForValue={(user: User) => user.email}
          value={value}
          onChange={setValue}
        />

        <p>Use these buttons to trigger a morph</p>
        <Button className="mx-2" onClick={() => setSize('small')}>
          Small
        </Button>
        <Button onClick={() => setSize('large')}>Large</Button>
      </Form>
    );
  })
  .add('jarb', () => {
    const [size, setSize] = useState('small');

    const promise = size === 'small' ? small : large;

    return (
      <FinalForm>
        <JarbValuePicker
          multiple={true}
          id="bestFriend"
          name="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          optionForValue={(user: User) => user.email}
          fetchOptions={() => promise}
          jarb={{
            validator: 'Hero.name',
            label: 'Best friend'
          }}
        />

        <p>Use these buttons to trigger a morph</p>
        <Button className="mx-2" onClick={() => setSize('small')}>
          Small
        </Button>
        <Button onClick={() => setSize('large')}>Large</Button>
      </FinalForm>
    );
  });

storiesOf('Form|ValuePicker/single', module)
  .addParameters({ component: ValuePicker })
  .add('basic', () => {
    const [value, setValue] = useState<User | undefined>(undefined);

    const [size, setSize] = useState('small');

    const promise = size === 'small' ? small : large;

    return (
      <Form>
        <ValuePicker<User>
          multiple={false}
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          fetchOptions={() => promise}
          optionForValue={(user: User) => user.email}
          value={value}
          onChange={setValue}
        />

        <p>Use these buttons to trigger a morph</p>
        <Button className="mx-2" onClick={() => setSize('small')}>
          Small
        </Button>
        <Button onClick={() => setSize('large')}>Large</Button>
      </Form>
    );
  })
  .add('jarb', () => {
    const [size, setSize] = useState('small');

    const promise = size === 'small' ? small : large;

    return (
      <FinalForm>
        <JarbValuePicker
          multiple={false}
          id="bestFriend"
          name="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          optionForValue={(user: User) => user.email}
          fetchOptions={() => promise}
          jarb={{
            validator: 'Hero.name',
            label: 'Best friend'
          }}
        />
        <p>Use these buttons to trigger a morph</p>
        <Button className="mx-2" onClick={() => setSize('small')}>
          Small
        </Button>
        <Button onClick={() => setSize('large')}>Large</Button>
      </FinalForm>
    );
  });
