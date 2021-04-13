import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';
import { Icon, pageOf, Tooltip } from '../../..';
import {
  FinalForm,
  Form,
  IsOptionEqualInfo,
  nonExistingProvince,
  Province,
  provinceFetcher,
  provinces,
  ReloadOptionsInfo,
  resolveAfter
} from '../../story-utils';
import TypeaheadSingle, { JarbTypeaheadSingle } from './TypeaheadSingle';

storiesOf('Form/Typeahead/JarbTypeaheadSingle', module)
  .add('predefined options', () => {
    const [value, setValue] = useState<Province | undefined>(
      nonExistingProvince()
    );

    return (
      <Form>
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
      </Form>
    );
  })
  .add('async options', () => {
    const [value, setValue] = useState<Province | undefined>(provinces()[0]);

    return (
      <Form>
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
      </Form>
    );
  })
  .add('async options - limited pageSize', () => {
    const [value, setValue] = useState<Province | undefined>(
      nonExistingProvince()
    );

    return (
      <Form>
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
      </Form>
    );
  })
  .add('disabled options', () => {
    const [value, setValue] = useState<Province | undefined>(
      nonExistingProvince()
    );

    return (
      <Form>
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
      </Form>
    );
  })
  .add('custom isOptionEqual', () => {
    const [value, setValue] = useState<Province | undefined>(provinces()[0]);

    return (
      <Form>
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
      </Form>
    );
  })
  .add('using reloadOptions', () => {
    const [brand, setBrand] = useState<string>();
    const [model, setModel] = useState<string>();

    const allOptions = {
      Audi: ['A1', 'A2', 'A3', 'M5'],
      BMW: ['series 1', 'series 2', 'series 3', 'series 4', 'series 5'],
      Mercedes: ['Viano', 'Vito', 'Sprinter']
    };

    return (
      <Form>
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
      </Form>
    );
  })
  .add('label & placeholder', () => {
    const [value, setValue] = useState<Province | undefined>(
      nonExistingProvince()
    );

    return (
      <Form>
        <h3>Without label</h3>

        <TypeaheadSingle<Province>
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
              <Tooltip className="ml-1" content="The province you live in">
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
      </Form>
    );
  })
  .add('jarb', () => {
    return (
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
    );
  });
