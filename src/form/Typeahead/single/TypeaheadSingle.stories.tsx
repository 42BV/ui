import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';
import { Card, Icon, pageOf, Tooltip } from '../../..';
import {
  FinalForm,
  IsOptionEqualInfo,
  JarbFormElementDependencies,
  nonExistingProvince,
  Province,
  provinceFetcher,
  provinces,
  ReloadOptionsInfo,
  resolveAfter
} from '../../story-utils';
import { JarbTypeaheadSingle, TypeaheadSingle } from './TypeaheadSingle';
import { Alert } from 'reactstrap';

storiesOf('Form/Typeahead/TypeaheadSingle', module)
  .addParameters({ component: TypeaheadSingle })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p className="mb-0">To be able to use TypeaheadSingle, you have to add react-bootstrap-typeahead to your dependencies:</p>
        <code>npm install --save react-bootstrap-typeahead</code>
        <p className="mb-0 mt-2">You also have to add the stylesheet to your project</p>
        <code>@import &apos;react-bootstrap-typeahead/css/Typeahead.css&apos;;</code>
      </Alert>
      <Story />
    </>
  ))
  .add('predefined options', () => {
    const [ value, setValue ] = useState<Province | undefined>(
      nonExistingProvince()
    );

    return (
      <Card className="m-2">
        <TypeaheadSingle<Province>
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
  .add('async options', () => {
    const [ value, setValue ] = useState<Province | undefined>(provinces()[0]);

    return (
      <Card className="m-2">
        <TypeaheadSingle<Province>
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
  .add('async options - limited pageSize', () => {
    const [ value, setValue ] = useState<Province | undefined>(
      nonExistingProvince()
    );

    return (
      <Card className="m-2">
        <TypeaheadSingle<Province>
          id="province"
          label="Province"
          placeholder="Please select your province"
          options={provinceFetcher}
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
  .add('disabled options', () => {
    const [ value, setValue ] = useState<Province | undefined>(
      nonExistingProvince()
    );

    return (
      <Card className="m-2">
        <TypeaheadSingle<Province>
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
        <TypeaheadSingle<Province>
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
        <TypeaheadSingle
          id="brand"
          label="Brand"
          placeholder="Please select your brand"
          options={() => resolveAfter(pageOf(Object.keys(allOptions), 1))}
          labelForOption={(option) => option}
          onChange={(value) => {
            setBrand(value);
            setModel(undefined);
          }}
          value={brand}
        />
        <TypeaheadSingle
          id="model"
          label="Model"
          placeholder={
            brand ? 'Please select your model' : 'Please select a brand first'
          }
          options={() =>
            resolveAfter(pageOf(brand ? allOptions[brand] : [], 1))
          }
          labelForOption={(option: string) => option}
          onChange={setModel}
          value={model}
          reloadOptions={brand}
        />

        {brand ? <p>Your chosen brand is: {brand}</p> : null}
        {model ? <p>Your chosen model is: {model}</p> : null}

        <ReloadOptionsInfo />
      </Card>
    );
  })
  .add('label & placeholder', () => {
    const [ value, setValue ] = useState<Province | undefined>(
      nonExistingProvince()
    );

    return (
      <Card className="m-2">
        <h3>Invisible label</h3>

        <TypeaheadSingle<Province>
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

        <TypeaheadSingle<Province>
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

        <h3>Without placeholder</h3>

        <TypeaheadSingle<Province>
          id="province"
          label="Province"
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
  .add('jarb', () => {
    return (
      <>
        <JarbFormElementDependencies />
        <FinalForm>
          <JarbTypeaheadSingle
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
  });
