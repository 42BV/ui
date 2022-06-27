import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import {
  FinalForm,
  IsOptionEqualInfo,
  JarbFormElementDependencies,
  nonExistingProvince,
  Province,
  provinceFetcher,
  provinces,
  ReloadOptionsInfo
} from '../../story-utils';

import { JarbTypeaheadMultiple, TypeaheadMultiple } from './TypeaheadMultiple';
import { Card, Icon, Tooltip } from '../../..';
import { Toggle } from '../../../core/Toggle/Toggle';
import { Alert } from 'reactstrap';

storiesOf('Form/Typeahead/TypeaheadMultiple', module)
  .addParameters({ component: TypeaheadMultiple })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p className="mb-0">To be able to use TypeaheadMultiple, you have to add react-bootstrap-typeahead to your dependencies:</p>
        <code>npm install --save react-bootstrap-typeahead</code>
        <p className="mb-0 mt-2">You also have to add the stylesheet to your project</p>
        <code>@import &apos;react-bootstrap-typeahead/css/Typeahead.css&apos;;</code>
      </Alert>
      <Story />
    </>
  ))
  .add('predefined options', () => {
    const [ value, setValue ] = useState<Province[] | undefined>([
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
    const [ value, setValue ] = useState<Province[] | undefined>([
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
    const [ value, setValue ] = useState<Province[] | undefined>([
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
          Note: Beware of performance issues when setting the page size too
          high, that will cause the UX to deteriorate on smaller screens!
        </p>
      </Card>
    );
  })
  .add('disabled options', () => {
    const [ value, setValue ] = useState<Province[] | undefined>([
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
    const [ value, setValue ] = useState<Province[] | undefined>([
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
    const [ limitToNorthern, setLimitToNorthern ] = useState(false);
    const [ value, setValue ] = useState<Province[] | undefined>([
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
  })
  .add('label & placeholder', () => {
    const [ value, setValue ] = useState<Province[] | undefined>([
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
  })
  .add('jarb', () => {
    return (
      <>
        <JarbFormElementDependencies />
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
      </>
    );
  });
