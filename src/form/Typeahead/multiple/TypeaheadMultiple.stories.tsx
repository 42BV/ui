import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import {
  FinalForm,
  IsOptionEqualInfo,
  ReloadOptionsInfo,
  Province,
  provinces,
  provinceFetcher,
  nonExistingProvince
} from '../../story-utils';

import TypeaheadMultiple, { JarbTypeaheadMultiple } from './TypeaheadMultiple';
import { Icon, Tooltip, Card } from '../../..';
import Toggle from '../../../core/Toggle/Toggle';

storiesOf('Form/Typeahead/JarbTypeaheadMultiple', module)
  .add('predefined options', () => {
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
  })
  .add('async options', () => {
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
  })

  .add('async options - limited pageSize', () => {
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
          pageSize={5}
        />

        {value ? (
          <p>
            Your chosen provinces are:{' '}
            {value.map((province) => province.label).join(', ')}
          </p>
        ) : null}

        <p>
          Note: Beware of performance issues when setting the page size too
          high, that will cause the UX to deteriorate on smaller screens!
        </p>
      </Card>
    );
  })
  .add('disabled options', () => {
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
  })
  .add('custom isOptionEqual', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      provinces()[0]
    ]);

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
  })
  .add('using reloadOptions', () => {
    const [limitToNorthern, setLimitToNorthern] = useState(false);
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Card className="m-2">
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
      </Card>
    );
  })
  .add('label & placeholder', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Card className="m-2">
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
      </Card>
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
