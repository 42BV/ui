import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import {
  Form,
  FinalForm,
  IsOptionEqualInfo,
  ReloadOptionsInfo,
  Province,
  provinces,
  provinceFetcher,
  nonExistingProvince
} from '../../story-utils';

import TypeaheadMultiple, { JarbTypeaheadMultiple } from './TypeaheadMultiple';
import { Icon, Tooltip } from '../../..';
import Toggle from '../../../core/Toggle/Toggle';

storiesOf('Form/Typeahead/JarbTypeaheadMultiple', module)
  .add('predefined options', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Form>
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
      </Form>
    );
  })
  .add('async options', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Form>
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
      </Form>
    );
  })
  .add('disabled options', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Form>
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
      </Form>
    );
  })
  .add('custom isOptionEqual', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      provinces()[0]
    ]);

    return (
      <Form>
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
      </Form>
    );
  })
  .add('using reloadOptions', () => {
    const [limitToNorthern, setLimitToNorthern] = useState(false);
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Form>
        <p>
          Limit to northern provinces
          <Toggle
            className="ml-2"
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
      </Form>
    );
  })
  .add('label & placeholder', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Form>
        <h3>Without label</h3>

        <TypeaheadMultiple
          placeholder="Please select your provinces"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
        />

        <hr />

        <h3>Custom label</h3>

        <TypeaheadMultiple
          id="provinces"
          label={
            <div className="d-flex justify-content-between">
              <span>Friends</span>
              <Tooltip className="ml-1" content="Provinces are nice to have">
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

        <hr />

        <h3>Without placeholder</h3>

        <TypeaheadMultiple
          id="provinces"
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
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbTypeaheadMultiple
          id="provinces"
          name="provinces"
          label="Provinces"
          placeholder="Please select your provinces"
          options={provinceFetcher}
          labelForOption={(province) => province.label}
          jarb={{
            validator: 'User.provinces',
            label: 'Provinces'
          }}
        />
      </FinalForm>
    );
  });
