import React, { Fragment, useState } from 'react';

import { pageWithContentAndExactSize } from '../../../test/utils';
import {
  adminUser,
  coordinatorUser,
  pageOfUsers,
  userUser
} from '../../../test/fixtures';
import { User } from '../../../test/types';

import {
  FieldModalPickerMultiple,
  JarbModalPickerMultiple,
  ModalPickerMultiple
} from './ModalPickerMultiple';

import {
  FieldFormElementDependencies,
  FinalForm,
  IsOptionEqualInfo,
  JarbFormElementDependencies,
  KeyForOptionInfo,
  nonExistingProvince,
  Province,
  provinceFetcher,
  provinces,
  ReloadOptionsInfo,
  resolveAfter
} from '../../../story-utils';
import { Card, Icon, Toggle, Tooltip } from '../../..';
import { Alert, ListGroup, ListGroupItem } from 'reactstrap';
import { Avatar } from '../../../core/Avatar/Avatar';
import classNames from 'classnames';

export default {
  title: 'Form/ModalPicker/ModalPickerMultiple',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p>
            To be able to use ModalPickerMultiple, you have to add
            @tippyjs/react and lodash to your dependencies:
          </p>
          <code>npm install --save @tippyjs/react lodash</code>
          <p className="mb-0 mt-2">
            You also have to add the stylesheet to your project
          </p>
          <code>@import &apos;tippy.js/dist/tippy.css&apos;;</code>
        </Alert>
        <Alert color="warning" className="mb-4">
          <p>
            To be able to use ModalPickerMultiple with Page, you have to add
            @42.nl/spring-connect to your dependencies:
          </p>
          <code>npm install --save @42.nl/spring-connect</code>
        </Alert>
        <Story />
      </>
    )
  ],

  parameters: {
    component: ModalPickerMultiple
  }
};

const PredefinedOptionsStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m2">
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
    </Card>
  );
};

export const PredefinedOptions = {
  render: PredefinedOptionsStory,
  name: 'predefined options'
};

const Show5OptionsPerPageStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m2">
      <ModalPickerMultiple
        id="provinces"
        label="Provinces"
        placeholder="Please select your provinces"
        options={provinces()}
        labelForOption={(province) => province.label}
        value={value}
        onChange={setValue}
        pageSize={5}
      />

      {value ? (
        <p>
          Your chosen provinces are:{' '}
          {value.map((province) => province.label).join(', ')}
        </p>
      ) : null}

      <p>
        Note: Beware of performance issues when setting the page size too high,
        that will cause the UX to deteriorate on smaller screens!
      </p>
    </Card>
  );
};

export const Show5OptionsPerPage = {
  render: Show5OptionsPerPageStory,
  name: 'show 5 options per page'
};

const AsyncOptionsStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m2">
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
    </Card>
  );
};

export const AsyncOptions = {
  render: AsyncOptionsStory,
  name: 'async options'
};

const DisabledOptionsStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m2">
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
    </Card>
  );
};

export const DisabledOptions = {
  render: DisabledOptionsStory,
  name: 'disabled options'
};

const CustomIsOptionEqualStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([provinces()[0]]);

  return (
    <Card className="m2">
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
    </Card>
  );
};

export const CustomIsOptionEqual = {
  render: CustomIsOptionEqualStory,
  name: 'custom isOptionEqual'
};

const CustomKeyForOptionStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([provinces()[0]]);

  return (
    <Card className="m2">
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
    </Card>
  );
};

export const CustomKeyForOption = {
  render: CustomKeyForOptionStory,
  name: 'custom keyForOption'
};

const UsingReloadOptionsStory = () => {
  const [limitToNorthern, setLimitToNorthern] = useState(false);
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m2">
      <p>
        <Toggle
          label="Limit to northern provinces"
          className="ms-2"
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
    </Card>
  );
};

export const UsingReloadOptions = {
  render: UsingReloadOptionsStory,
  name: 'using reloadOptions'
};

const WithExtraAddButtonStory = () => {
  const [value, setValue] = useState<User[] | undefined>([]);

  return (
    <Card className="m2">
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
    </Card>
  );
};

export const WithExtraAddButton = {
  render: WithExtraAddButtonStory,
  name: 'with extra add button'
};

const WithoutSearchStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m2">
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
    </Card>
  );
};

export const WithoutSearch = {
  render: WithoutSearchStory,
  name: 'without search'
};

const CustomRenderOptionsStory = () => {
  const [value, setValue] = useState<User[] | undefined>([]);

  return (
    <Card className="m2">
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
                    src="https://picsum.photos/100/100"
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
    </Card>
  );
};

export const CustomRenderOptions = {
  render: CustomRenderOptionsStory,
  name: 'custom renderOptions'
};

const CustomRenderValueStory = () => {
  const [value, setValue] = useState<User[] | undefined>([]);

  return (
    <Card className="m2">
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
    </Card>
  );
};

export const CustomRenderValue = {
  render: CustomRenderValueStory,
  name: 'custom renderValue'
};

const ButtonAlignmentStory = () => {
  const [value, setValue] = useState<User[] | undefined>([]);

  return (
    <Card className="m2">
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
    </Card>
  );
};

export const ButtonAlignment = {
  render: ButtonAlignmentStory,
  name: 'button alignment'
};

const LabelsStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m2">
      <h3>Invisible label</h3>

      <ModalPickerMultiple
        id="provinces"
        label="Province"
        hiddenLabel={true}
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
              className="ms-1"
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
    </Card>
  );
};

export const Labels = {
  render: LabelsStory,
  name: 'labels'
};

const WithIconStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m2">
      <h3>Without icon</h3>

      <ModalPickerMultiple
        id="provinces"
        label="Province"
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
        label="Province"
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
    </Card>
  );
};

export const WithIcon = {
  render: WithIconStory,
  name: 'with icon'
};

const WithoutClearButtonStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m2">
      <ModalPickerMultiple
        id="provinces"
        label="Province"
        placeholder="Please select your provinces"
        options={provinces()}
        labelForOption={(province) => province.label}
        value={value}
        onChange={setValue}
        canClear={false}
      />
    </Card>
  );
};

export const WithoutClearButton = {
  render: WithoutClearButtonStory,
  name: 'without clear button'
};

const WithCustomTextStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m2">
      <ModalPickerMultiple
        id="provinces"
        label="Provinces"
        placeholder="Please select your provinces"
        options={provinces()}
        labelForOption={(province) => province.label}
        value={value}
        onChange={setValue}
        text={{
          cancel: 'Take me back',
          select: 'Confirm my choice'
        }}
      />

      {value ? (
        <p>
          Your chosen provinces are:{' '}
          {value.map((province) => province.label).join(', ')}
        </p>
      ) : null}
    </Card>
  );
};

export const WithCustomText = {
  render: WithCustomTextStory,
  name: 'with custom text'
};

const FieldStory = () => {
  return (
    <>
      <FieldFormElementDependencies />
      <FinalForm>
        <FieldModalPickerMultiple
          id="provinces"
          name="provinces"
          label="Provinces"
          placeholder="Please select your provinces"
          options={provinceFetcher}
          labelForOption={(province) => province.label}
        />
      </FinalForm>
    </>
  );
};

export const Field = {
  render: FieldStory,
  name: 'field'
};

const JarbStory = () => {
  return (
    <>
      <JarbFormElementDependencies />
      <FinalForm>
        <JarbModalPickerMultiple
          id="provinces"
          name="provinces"
          placeholder="Please select your provinces"
          options={provinceFetcher}
          labelForOption={(province) => province.label}
          jarb={{
            validator: 'User.provinces',
            label: 'Provinces'
          }}
        />
      </FinalForm>
    </>
  );
};

export const Jarb = {
  render: JarbStory,
  name: 'jarb'
};
