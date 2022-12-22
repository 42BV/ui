import React, { useState } from 'react';

import { pageWithContent, pageWithContentAndExactSize } from '../../test/utils';
import { adminUser, randomUser, userUser } from '../../test/fixtures';
import { User } from '../../test/types';

import { FieldValuePicker, JarbValuePicker, ValuePicker } from './ValuePicker';

import {
  FieldFormElementDependencies,
  FinalForm,
  JarbFormElementDependencies
} from '../../story-utils';
import { Button } from '../../core/Button/Button';
import { Alert } from 'reactstrap';
import { Card } from '../../core/Card/Card';
import { Tooltip } from '../../core/Tooltip/Tooltip';
import { Icon } from '../../core/Icon';

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

export default {
  title: 'Form/ValuePicker/multiple',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p className="mb-0">
            To be able to use ValuePicker, you have to add @tippyjs/react to
            your dependencies:
          </p>
          <code>npm install --save @tippyjs/react</code>
          <p className="mb-0 mt-2">
            You also have to add the stylesheet to your project
          </p>
          <code>@import &apos;tippy.js/dist/tippy.css&apos;;</code>
        </Alert>
        <Alert color="warning" className="mb-4">
          <p>
            To be able to use ValuePicker with Page, you have to add
            @42.nl/spring-connect to your dependencies:
          </p>
          <code>npm install --save @42.nl/spring-connect</code>
        </Alert>
        <Story />
      </>
    )
  ],

  parameters: {
    component: ValuePicker
  }
};

const BasicStory = () => {
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
};

export const Basic = {
  render: BasicStory,
  name: 'basic'
};

const CustomIsOptionEqualStory = () => {
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
};

export const CustomIsOptionEqual = {
  render: CustomIsOptionEqualStory,
  name: 'custom isOptionEqual'
};

const InvisibleLabelStory = () => {
  const [value, setValue] = useState<User[] | undefined>(undefined);

  const [size, setSize] = useState('small');

  const promise = sizes[size];

  return (
    <Card className="m-2">
      <ValuePicker<User>
        multiple={true}
        id="bestFriend"
        label="Best friend"
        hiddenLabel={true}
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
};

export const InvisibleLabel = {
  render: InvisibleLabelStory,
  name: 'invisible label'
};

const WithCustomLabelStory = () => {
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
};

export const WithCustomLabel = {
  render: WithCustomLabelStory,
  name: 'with custom label'
};

const WithIconStory = () => {
  const [value, setValue] = useState<User[] | undefined>(undefined);

  const promise = sizes['large'];

  return (
    <Card className="m-2">
      <ValuePicker<User>
        multiple={true}
        id="bestFriend"
        label="Best friend"
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
};

export const WithIcon = {
  render: WithIconStory,
  name: 'with icon'
};

const WithoutClearButtonStory = () => {
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
        <strong>Disclaimer:</strong> canClear has no effect on small option sets
        (1-10 options) because checkboxes can be unselected.
      </p>
    </Card>
  );
};

export const WithoutClearButton = {
  render: WithoutClearButtonStory,
  name: 'without clear button'
};

const FieldStory = () => {
  const [size, setSize] = useState('small');

  const promise = sizes[size];

  return (
    <>
      <FieldFormElementDependencies />
      <FinalForm>
        <FieldValuePicker
          multiple={true}
          id="bestFriend"
          name="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          labelForOption={(user: User) => user.email}
          options={() => promise}
        />

        <p>Use these buttons to trigger a morph</p>
        <Button className="mx-2" onClick={() => setSize('small')}>
          Small
        </Button>
        <Button onClick={() => setSize('large')}>Large</Button>
      </FinalForm>
    </>
  );
};

export const Field = {
  render: FieldStory,
  name: 'field'
};

const JarbStory = () => {
  const [size, setSize] = useState('small');

  const promise = sizes[size];

  return (
    <>
      <JarbFormElementDependencies />
      <FinalForm>
        <JarbValuePicker
          multiple={true}
          id="bestFriend"
          name="bestFriend"
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
    </>
  );
};

export const Jarb = {
  render: JarbStory,
  name: 'jarb'
};
