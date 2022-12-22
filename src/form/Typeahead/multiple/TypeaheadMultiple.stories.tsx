import React, { useState } from 'react';

import {
  FieldFormElementDependencies,
  FinalForm,
  IsOptionEqualInfo,
  JarbFormElementDependencies,
  nonExistingProvince,
  Province,
  provinceFetcher,
  provinces,
  ReloadOptionsInfo
} from '../../../story-utils';

import {
  FieldTypeaheadMultiple,
  JarbTypeaheadMultiple,
  TypeaheadMultiple
} from './TypeaheadMultiple';
import { Card, Icon, isTypeaheadCustomOption, Tooltip } from '../../..';
import { Toggle } from '../../../core/Toggle/Toggle';
import { Alert } from 'reactstrap';

export default {
  title: 'Form/Typeahead/TypeaheadMultiple',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p className="mb-0">
            To be able to use TypeaheadMultiple, you have to add
            react-bootstrap-typeahead to your dependencies:
          </p>
          <code>npm install --save react-bootstrap-typeahead</code>
          <p className="mb-0 mt-2">
            You also have to add the stylesheet to your project
          </p>
          <code>
            @import &apos;react-bootstrap-typeahead/css/Typeahead.css&apos;;
          </code>
        </Alert>
        <Story />
      </>
    )
  ],

  parameters: {
    component: TypeaheadMultiple
  }
};

const PredefinedOptionsStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m-2">
      <TypeaheadMultiple
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

const AsyncOptionsStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m-2">
      <TypeaheadMultiple
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

const AsyncOptionsLimitedPageSizeStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m-2">
      <TypeaheadMultiple
        id="provinces"
        label="Provinces"
        placeholder="Please select your provinces"
        options={provinceFetcher}
        labelForOption={(province) => province.label}
        value={value}
        onChange={setValue}
        maxResults={2}
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

export const AsyncOptionsLimitedPageSize = {
  render: AsyncOptionsLimitedPageSizeStory,
  name: 'async options - limited pageSize'
};

const DisabledOptionsStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m-2">
      <TypeaheadMultiple
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
    <Card className="m-2">
      <TypeaheadMultiple
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

const UsingReloadOptionsStory = () => {
  const [limitToNorthern, setLimitToNorthern] = useState(false);
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m-2">
      <p>
        <Toggle
          label="Limit to northern provinces"
          className="ms-2"
          color="primary"
          value={limitToNorthern}
          onChange={() => setLimitToNorthern(!limitToNorthern)}
        />
      </p>

      <TypeaheadMultiple
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

const AllowNewStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([]);

  return (
    <Card className="m-2">
      <TypeaheadMultiple
        id="provinces"
        label="Provinces"
        placeholder="Please select your provinces"
        options={provinces()}
        labelForOption={(option) => option.label}
        value={value}
        onChange={(selectedProvinces) => {
          setValue(
            selectedProvinces
              ? selectedProvinces.map((p) =>
                  isTypeaheadCustomOption(p)
                    ? { id: -1, label: p.label, value: p.label, north: false }
                    : p
                )
              : undefined
          );
        }}
        allowNew={true}
      />

      {value ? (
        <p>
          Your chosen provinces are:{' '}
          {value.map((province) => province.label).join(',')}
        </p>
      ) : null}

      <p>
        Whenever <code>allowNew</code> is <code>true</code>, the value you get
        in onChange might contain a TypeaheadCustomOption. You have to convert
        this option to a type you can work with yourself.
      </p>
    </Card>
  );
};

export const AllowNew = {
  render: AllowNewStory,
  name: 'allow new'
};

const LabelPlaceholderStory = () => {
  const [value, setValue] = useState<Province[] | undefined>([
    nonExistingProvince()
  ]);

  return (
    <Card className="m-2">
      <span className="d-block fs-5">Invisible label</span>

      <TypeaheadMultiple
        id="provinces"
        label="Provinces"
        hiddenLabel={true}
        placeholder="Please select your provinces"
        options={provinces()}
        labelForOption={(province) => province.label}
        value={value}
        onChange={setValue}
      />

      <hr />

      <span className="d-block fs-5">Custom label</span>

      <TypeaheadMultiple
        id="friends"
        label={
          <div className="d-flex justify-content-between">
            <span>Friends</span>
            <Tooltip className="ms-1" content="Provinces are nice to have">
              <Icon icon="info" />
            </Tooltip>
          </div>
        }
        placeholder="Please select your friends"
        options={provinces()}
        labelForOption={(province) => province.label}
        value={value}
        onChange={setValue}
      />

      <hr />

      <span className="d-block fs-5">Without placeholder</span>

      <TypeaheadMultiple
        id="no-placeholder"
        label="Provinces"
        options={provinces()}
        labelForOption={(province) => province.label}
        value={value}
        onChange={setValue}
      />

      <hr />

      {value ? (
        <p>
          Your chosen provinces are:{' '}
          {value.map((province) => province.label).join(', ')}
        </p>
      ) : null}
    </Card>
  );
};

export const LabelPlaceholder = {
  render: LabelPlaceholderStory,
  name: 'label & placeholder'
};

const FieldStory = () => {
  return (
    <>
      <FieldFormElementDependencies />
      <FinalForm>
        <FieldTypeaheadMultiple
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
        <JarbTypeaheadMultiple
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
