import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { pageWithContentAndExactSize, pageWithContent } from '../../test/utils';
import { userUser, adminUser, randomUser } from '../../test/fixtures';
import { User } from '../../test/types';

import ValuePicker, { JarbValuePicker } from './ValuePicker';

import { FinalForm } from '../story-utils';
import Button from '../../core/Button/Button';
import { Tooltip, Icon, Card } from '../..';

/*
  Storing users here instead of calling the fixtures again so
  options remain selected.
*/
const user = userUser();
const admin = adminUser();

const randomUser1 = randomUser();
const randomUser2 = randomUser();
const randomUser3 = randomUser();
const randomUser4 = randomUser();
const randomUser5 = randomUser();
const randomUser6 = randomUser();
const randomUser7 = randomUser();
const randomUser8 = randomUser();
const randomUser9 = randomUser();
const randomUser10 = randomUser();
const randomUser11 = randomUser();

const small = Promise.resolve(pageWithContentAndExactSize([user, admin]));

const medium = Promise.resolve(
  pageWithContentAndExactSize([
    user,
    admin,
    randomUser1,
    randomUser2,
    randomUser3,
    randomUser4
  ])
);

const large = Promise.resolve(
  pageWithContent([
    user,
    admin,
    randomUser1,
    randomUser2,
    randomUser3,
    randomUser4,
    randomUser5,
    randomUser6,
    randomUser7,
    randomUser8,
    randomUser9,
    randomUser10,
    randomUser11
  ])
);

const sizes = { small, medium, large };

storiesOf('Form/ValuePicker/multiple', module)
  .addParameters({ component: ValuePicker })
  .add('basic', () => {
    const [value, setValue] = useState<User[] | undefined>(undefined);

    const [size, setSize] = useState('small');

    const promise = sizes[size];

    return (
      <Card className="m-2">
        <ValuePicker<User>
          multiple={true}
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          options={() => promise}
          labelForOption={(user: User) => user.email}
          value={value}
          onChange={setValue}
        />

        <p>Use these buttons to trigger a morph</p>
        <Button className="mx-2" onClick={() => setSize('small')}>
          Small
        </Button>
        <Button onClick={() => setSize('large')}>Large</Button>
      </Card>
    );
  })
  .add('custom isOptionEqual', () => {
    const [value, setValue] = useState<User[] | undefined>([user]);

    const [size, setSize] = useState('small');

    const promise = sizes[size];

    return (
      <Card className="m-2">
        <ValuePicker<User>
          multiple={true}
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          options={() => promise}
          labelForOption={(user: User) => user.email}
          isOptionEqual={(a: User, b: User) => a.id === b.id}
          value={value}
          onChange={setValue}
        />

        <p>Use these buttons to trigger a morph</p>
        <Button className="mx-2" onClick={() => setSize('small')}>
          Small
        </Button>
        <Button onClick={() => setSize('large')}>Large</Button>
      </Card>
    );
  })
  .add('without label', () => {
    const [value, setValue] = useState<User[] | undefined>(undefined);

    const [size, setSize] = useState('small');

    const promise = sizes[size];

    return (
      <Card className="m-2">
        <ValuePicker<User>
          multiple={true}
          id="bestFriend"
          placeholder="Select your best friend"
          canSearch={true}
          options={() => promise}
          labelForOption={(user: User) => user.email}
          value={value}
          onChange={setValue}
        />

        <p>Use these buttons to trigger a morph</p>
        <Button className="mx-2" onClick={() => setSize('small')}>
          Small
        </Button>
        <Button onClick={() => setSize('large')}>Large</Button>
      </Card>
    );
  })
  .add('with custom label', () => {
    const [value, setValue] = useState<User[] | undefined>(undefined);

    const [size, setSize] = useState('small');

    const promise = sizes[size];

    return (
      <Card className="m-2">
        <ValuePicker<User>
          multiple={true}
          id="bestFriend"
          label={
            <div className="d-flex justify-content-between">
              <span>Best friend</span>
              <Tooltip
                className="ms-1"
                content="Don't be jealous of your best friends wife"
              >
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Select your best friend"
          canSearch={true}
          options={() => promise}
          labelForOption={(user: User) => user.email}
          value={value}
          onChange={setValue}
        />

        <p>Use these buttons to trigger a morph</p>
        <Button className="mx-2" onClick={() => setSize('small')}>
          Small
        </Button>
        <Button onClick={() => setSize('large')}>Large</Button>
      </Card>
    );
  })
  .add('with icon', () => {
    const [value, setValue] = useState<User[] | undefined>(undefined);

    const promise = sizes['large'];

    return (
      <Card className="m-2">
        <ValuePicker<User>
          multiple={true}
          id="bestFriend"
          placeholder="Select your best friend"
          icon="face"
          canSearch={true}
          options={() => promise}
          labelForOption={(user: User) => user.email}
          value={value}
          onChange={setValue}
        />

        <p>The icon only works when there are more than 10 options.</p>
      </Card>
    );
  })
  .add('without clear button', () => {
    const [value, setValue] = useState<User[] | undefined>([user]);

    const promise = sizes['large'];

    return (
      <Card className="m-2">
        <ValuePicker<User>
          multiple={true}
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          options={() => promise}
          labelForOption={(user: User) => user.email}
          value={value}
          onChange={setValue}
          canClear={false}
        />
        <p className="mt-3">
          <strong>Disclaimer:</strong> canClear has no effect on small option
          sets (1-10 options) because checkboxes can be unselected.
        </p>
      </Card>
    );
  })
  .add('jarb', () => {
    const [size, setSize] = useState('small');

    const promise = sizes[size];

    return (
      <FinalForm>
        <JarbValuePicker
          multiple={true}
          id="bestFriend"
          name="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          labelForOption={(user: User) => user.email}
          options={() => promise}
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

storiesOf('Form/ValuePicker/single', module)
  .addParameters({ component: ValuePicker })
  .add('basic', () => {
    const [value, setValue] = useState<User | undefined>(undefined);

    const [size, setSize] = useState('small');

    const promise = sizes[size];

    return (
      <Card className="m-2">
        <ValuePicker<User>
          multiple={false}
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          options={() => promise}
          labelForOption={(user: User) => user.email}
          value={value}
          onChange={setValue}
        />

        <p>Use these buttons to trigger a morph</p>
        <Button className="me-1" onClick={() => setSize('small')}>
          Small
        </Button>
        <Button className="me-1" onClick={() => setSize('medium')}>
          Medium
        </Button>
        <Button onClick={() => setSize('large')}>Large</Button>
      </Card>
    );
  })
  .add('custom isOptionEqual', () => {
    const [value, setValue] = useState<User | undefined>(userUser);

    const [size, setSize] = useState('small');

    const promise = sizes[size];

    return (
      <Card className="m-2">
        <ValuePicker<User>
          multiple={false}
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          options={() => promise}
          labelForOption={(user: User) => user.email}
          isOptionEqual={(a: User, b: User) => a.id === b.id}
          value={value}
          onChange={setValue}
        />

        <p>Use these buttons to trigger a morph</p>
        <Button className="me-1" onClick={() => setSize('small')}>
          Small
        </Button>
        <Button className="me-1" onClick={() => setSize('medium')}>
          Medium
        </Button>
        <Button onClick={() => setSize('large')}>Large</Button>
      </Card>
    );
  })
  .add('without label', () => {
    const [value, setValue] = useState<User | undefined>(undefined);

    const [size, setSize] = useState('small');

    const promise = sizes[size];

    return (
      <Card className="m-2">
        <ValuePicker<User>
          multiple={false}
          id="bestFriend"
          placeholder="Select your best friend"
          canSearch={true}
          options={() => promise}
          labelForOption={(user: User) => user.email}
          value={value}
          onChange={setValue}
        />

        <p>Use these buttons to trigger a morph</p>
        <Button className="me-1" onClick={() => setSize('small')}>
          Small
        </Button>
        <Button className="me-1" onClick={() => setSize('medium')}>
          Medium
        </Button>
        <Button onClick={() => setSize('large')}>Large</Button>
      </Card>
    );
  })
  .add('with custom label', () => {
    const [value, setValue] = useState<User | undefined>(undefined);

    const [size, setSize] = useState('small');

    const promise = sizes[size];

    return (
      <Card className="m-2">
        <ValuePicker<User>
          multiple={false}
          id="bestFriend"
          label={
            <div className="d-flex justify-content-between">
              <span>Best friend</span>
              <Tooltip
                className="ms-1"
                content="Don't be jealous of your best friends wife"
              >
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Select your best friend"
          canSearch={true}
          options={() => promise}
          labelForOption={(user: User) => user.email}
          value={value}
          onChange={setValue}
        />

        <p>Use these buttons to trigger a morph</p>
        <Button className="me-1" onClick={() => setSize('small')}>
          Small
        </Button>
        <Button className="me-1" onClick={() => setSize('medium')}>
          Medium
        </Button>
        <Button onClick={() => setSize('large')}>Large</Button>
      </Card>
    );
  })
  .add('with icon', () => {
    const [value, setValue] = useState<User | undefined>(undefined);

    const promise = sizes['large'];

    return (
      <Card className="m-2">
        <ValuePicker<User>
          multiple={false}
          id="bestFriend"
          placeholder="Select your best friend"
          icon="face"
          canSearch={true}
          options={() => promise}
          labelForOption={(user: User) => user.email}
          value={value}
          onChange={setValue}
        />

        <p>The icon only works when there are more than 10 options.</p>
      </Card>
    );
  })
  .add('without clear button', () => {
    const [value, setValue] = useState<User | undefined>(user);

    const [size, setSize] = useState('small');

    const promise = sizes[size];

    return (
      <Card className="m-2">
        <ValuePicker<User>
          multiple={false}
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          options={() => promise}
          labelForOption={(user: User) => user.email}
          value={value}
          onChange={setValue}
          canClear={false}
        />

        <p>Use these buttons to trigger a morph</p>
        <Button className="me-1" onClick={() => setSize('small')}>
          Small
        </Button>
        <Button onClick={() => setSize('large')}>Large</Button>
        <p className="mt-3">
          <strong>Disclaimer:</strong> canClear has no effect on medium option
          sets (4-10 options) because the select dropdown has a placeholder
          option to clear the value.
        </p>
      </Card>
    );
  })
  .add('jarb', () => {
    const [size, setSize] = useState('small');

    const promise = sizes[size];

    return (
      <FinalForm>
        <JarbValuePicker
          multiple={false}
          id="bestFriend"
          name="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          options={() => promise}
          labelForOption={(user: User) => user.email}
          jarb={{
            validator: 'Hero.name',
            label: 'Best friend'
          }}
        />
        <p>Use these buttons to trigger a morph</p>
        <Button className="me-1" onClick={() => setSize('small')}>
          Small
        </Button>
        <Button className="me-1" onClick={() => setSize('medium')}>
          Medium
        </Button>
        <Button onClick={() => setSize('large')}>Large</Button>
      </FinalForm>
    );
  });
