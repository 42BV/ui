import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { FieldModalPickerSingle, JarbModalPickerSingle, ModalPickerSingle } from './ModalPickerSingle';
import {
  FieldFormElementDependencies,
  FinalForm,
  IsOptionEqualInfo,
  JarbFormElementDependencies,
  KeyForOptionInfo,
  Province,
  provinceFetcher,
  provinces,
  ReloadOptionsInfo,
  resolveAfter
} from '../../../story-utils';
import { pageWithContentAndExactSize } from '../../../test/utils';
import { adminUser, coordinatorUser, userUser } from '../../../test/fixtures';
import { User } from '../../../test/types';
import { Card, Icon, pageOf, Tooltip } from '../../..';
import { Avatar } from '../../../core/Avatar/Avatar';
import { Alert, ListGroup, ListGroupItem } from 'reactstrap';
import classNames from 'classnames';

storiesOf('Form/ModalPicker/ModalPickerSingle', module)
  .addParameters({ component: ModalPickerSingle })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p>To be able to use ModalPickerSingle, you have to add @tippyjs/react and lodash to your dependencies:</p>
        <code>npm install --save @tippyjs/react lodash</code>
        <p className="mb-0 mt-2">You also have to add the stylesheet to your project</p>
        <code>@import &apos;tippy.js/dist/tippy.css&apos;;</code>
      </Alert>
      <Alert color="warning" className="mb-4">
        <p>To be able to use ModalPickerSingle with Page, you have to add @42.nl/spring-connect to your dependencies:</p>
        <code>npm install --save @42.nl/spring-connect</code>
      </Alert>
      <Story />
    </>
  ))
  .add('predefined options', () => {
    const [ value, setValue ] = useState<Province | undefined>(undefined);

    return (
      <Card className="m-2">
        <ModalPickerSingle<Province>
          id="province"
          label="Province"
          placeholder="Please select your province"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
        />

        {value ? <p>Your chosen province is: {value.label}</p> : null}
      </Card>
    );
  })
  .add('show 5 options per page', () => {
    const [ value, setValue ] = useState<Province | undefined>(undefined);

    return (
      <Card className="m-2">
        <ModalPickerSingle<Province>
          id="province"
          label="Province"
          placeholder="Please select your province"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
          pageSize={5}
        />

        {value ? <p>Your chosen province is: {value.label}</p> : null}

        <p>
          Note: Beware of performance issues when setting the page size too
          high, that will cause the UX to deteriorate on smaller screens!
        </p>
      </Card>
    );
  })
  .add('async options', () => {
    const [ value, setValue ] = useState<Province | undefined>(provinces()[0]);

    return (
      <Card className="m-2">
        <ModalPickerSingle<Province>
          id="province"
          label="Province"
          placeholder="Please select your province"
          options={provinceFetcher}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
        />

        {value ? <p>Your chosen province is: {value.label}</p> : null}
      </Card>
    );
  })
  .add('disabled options', () => {
    const [ value, setValue ] = useState<Province | undefined>(undefined);

    return (
      <Card className="m-2">
        <ModalPickerSingle<Province>
          id="province"
          label="Province"
          placeholder="Please select your province"
          options={provinces()}
          labelForOption={(province) => province.label}
          isOptionEnabled={(option) => !option.label.startsWith('Z')}
          value={value}
          onChange={setValue}
        />

        {value ? <p>Your chosen province is: {value.label}</p> : null}
      </Card>
    );
  })
  .add('custom isOptionEqual', () => {
    const [ value, setValue ] = useState<Province | undefined>(provinces()[0]);

    return (
      <Card className="m-2">
        <ModalPickerSingle<Province>
          id="province"
          label="Province"
          placeholder="Please select your province"
          options={provinces()}
          labelForOption={(province) => province.label}
          isOptionEqual={(a, b) => a.value === b.value}
          value={value}
          onChange={setValue}
        />

        {value ? <p>Your chosen province is: {value.label}</p> : null}

        <IsOptionEqualInfo />
      </Card>
    );
  })
  .add('custom keyForOption', () => {
    const [ value, setValue ] = useState<Province | undefined>(provinces()[0]);

    return (
      <Card className="m-2">
        <ModalPickerSingle<Province>
          id="province"
          label="Province"
          placeholder="Please select your province"
          options={provinces()}
          labelForOption={(province) => province.label}
          keyForOption={(province) => province.value}
          value={value}
          onChange={setValue}
        />

        {value ? <p>Your chosen province is: {value.label}</p> : null}

        <KeyForOptionInfo />
      </Card>
    );
  })
  .add('using reloadOptions', () => {
    const [ brand, setBrand ] = useState<string>();
    const [ model, setModel ] = useState<string>();

    const allOptions = {
      Audi: [ 'A1', 'A2', 'A3', 'M5' ],
      BMW: [ 'series 1', 'series 2', 'series 3', 'series 4', 'series 5' ],
      Mercedes: [ 'Viano', 'Vito', 'Sprinter' ]
    };

    return (
      <Card className="m-2">
        <ModalPickerSingle
          id="brand"
          label="Brand"
          placeholder="Please select your brand"
          options={() => resolveAfter(pageOf(Object.keys(allOptions), 1))}
          labelForOption={(option) => option}
          value={brand}
          onChange={(value) => {
            setBrand(value);
            setModel(undefined);
          }}
        />
        <ModalPickerSingle
          id="model"
          label="Model"
          placeholder={
            brand ? 'Please select your model' : 'Please select a brand first'
          }
          options={() =>
            resolveAfter(pageOf(brand ? allOptions[brand] : [], 1))
          }
          labelForOption={(option: string) => option}
          value={model}
          onChange={setModel}
          reloadOptions={brand}
        />

        {brand ? <p>Your chosen brand is: {brand}</p> : null}
        {model ? <p>Your chosen model is: {model}</p> : null}

        <ReloadOptionsInfo />
      </Card>
    );
  })
  .add('with extra add button', () => {
    const [ value, setValue ] = useState<User | undefined>(undefined);

    return (
      <Card className="m-2">
        <ModalPickerSingle<User>
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          labelForOption={(user: User) => user.email}
          options={() =>
            Promise.resolve(pageWithContentAndExactSize([ userUser() ]))
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
  })
  .add('without search', () => {
    const [ value, setValue ] = useState<User | undefined>(undefined);

    return (
      <Card className="m-2">
        <ModalPickerSingle
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={false}
          labelForOption={(user: User) => user.email}
          options={() =>
            Promise.resolve(pageWithContentAndExactSize([ userUser() ]))
          }
          value={value}
          onChange={setValue}
        />
      </Card>
    );
  })
  .add('custom renderOptions', () => {
    const [ value, setValue ] = useState<User | undefined>();

    return (
      <Card className="m-2">
        <ModalPickerSingle<User>
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          options={[ userUser(), adminUser(), coordinatorUser() ]}
          labelForOption={(user: User) => user.email}
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
      </Card>
    );
  })
  .add('custom renderValue', () => {
    const [ value, setValue ] = useState<User | undefined>(undefined);

    return (
      <Card className="m-2">
        <ModalPickerSingle
          id="bestFriend"
          label="Best friend"
          placeholder="Select your best friend"
          canSearch={true}
          options={[ userUser(), adminUser(), coordinatorUser() ]}
          labelForOption={(user) => user.email}
          value={value}
          onChange={(user) => setValue(user)}
          renderValue={(user) => {
            return user ? (
              <>
                {user.roles.some((role) => role === 'ADMIN') ? (
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
      </Card>
    );
  })
  .add('button alignment', () => {
    const [ value, setValue ] = useState<User | undefined>(undefined);

    return (
      <Card className="m-2">
        <ModalPickerSingle
          id="bestFriend"
          label="Default"
          placeholder="Select your best friend"
          canSearch={true}
          labelForOption={(user: User) => user.email}
          options={() =>
            Promise.resolve(
              pageWithContentAndExactSize([ userUser(), adminUser() ])
            )
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
          labelForOption={(user: User) => user.email}
          options={() =>
            Promise.resolve(
              pageWithContentAndExactSize([ userUser(), adminUser() ])
            )
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
          labelForOption={(user: User) => user.email}
          options={() =>
            Promise.resolve(
              pageWithContentAndExactSize([ userUser(), adminUser() ])
            )
          }
          value={value}
          onChange={setValue}
          alignButton="right"
        />
      </Card>
    );
  })
  .add('label & placeholder', () => {
    const [ value, setValue ] = useState<Province | undefined>(undefined);

    return (
      <Card className="m-2">
        <h3>Invisible label</h3>

        <ModalPickerSingle<Province>
          label="Province"
          hiddenLabel={true}
          placeholder="Please select your province"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
        />

        <hr />

        <h3>Custom label</h3>

        <ModalPickerSingle<Province>
          id="provinces"
          label={
            <div className="d-flex justify-content-between">
              <span>Subject</span>
              <Tooltip className="ms-1" content="The province you live in">
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Please select your province"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
        />

        <hr />

        {value ? <p>Your chosen province is: {value.label}</p> : null}
      </Card>
    );
  })
  .add('icon', () => {
    const [ value, setValue ] = useState<Province | undefined>(undefined);

    return (
      <Card className="m-2">
        <h3>Without icon</h3>

        <ModalPickerSingle<Province>
          label="Province"
          placeholder="Please select your province"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
        />

        <hr />

        <h3>With icon</h3>

        <ModalPickerSingle<Province>
          id="provinces"
          label="Province"
          placeholder="Please select your province"
          icon="home"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
        />

        <hr />

        {value ? <p>Your chosen province is: {value.label}</p> : null}
      </Card>
    );
  })
  .add('without clear button', () => {
    const [ value, setValue ] = useState<Province | undefined>(provinces()[0]);

    return (
      <Card className="m-2">
        <ModalPickerSingle<Province>
          label="Province"
          placeholder="Please select your province"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
          canClear={false}
        />
      </Card>
    );
  })
  .add('with custom text', () => {
    const [ value, setValue ] = useState<Province | undefined>(undefined);

    return (
      <Card className="m-2">
        <ModalPickerSingle<Province>
          id="province"
          label="Province"
          placeholder="Please select your province"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
          text={{
            cancel: 'Take me back',
            select: 'Confirm my choice'
          }}
        />

        {value ? <p>Your chosen province is: {value.label}</p> : null}
      </Card>
    );
  })
  .add('field', () => {
    return (
      <>
        <FieldFormElementDependencies />
        <FinalForm>
          <FieldModalPickerSingle
            id="province"
            name="province"
            label="Province"
            placeholder="Please select your province"
            options={provinceFetcher}
            labelForOption={(province) => province.label}
            jarb={{
              validator: 'User.province',
              label: 'Province'
            }}
          />
        </FinalForm>
      </>
    );
  })
  .add('jarb', () => {
    return (
      <>
        <JarbFormElementDependencies />
        <FinalForm>
          <JarbModalPickerSingle
            id="province"
            name="province"
            placeholder="Please select your province"
            options={provinceFetcher}
            labelForOption={(province) => province.label}
            jarb={{
              validator: 'User.province',
              label: 'Province'
            }}
          />
        </FinalForm>
      </>
    );
  });
