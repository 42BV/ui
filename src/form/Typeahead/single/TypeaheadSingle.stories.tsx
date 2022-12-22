import React, { useState } from 'react';
import { Card, Icon, isTypeaheadCustomOption, pageOf, Tooltip } from '../../..';
import {
  FieldFormElementDependencies,
  FinalForm,
  IsOptionEqualInfo,
  JarbFormElementDependencies,
  nonExistingProvince,
  Province,
  provinceFetcher,
  provinces,
  ReloadOptionsInfo,
  resolveAfter
} from '../../../story-utils';
import {
  FieldTypeaheadSingle,
  JarbTypeaheadSingle,
  TypeaheadSingle
} from './TypeaheadSingle';
import { Alert } from 'reactstrap';

export default {
  title: 'Form/Typeahead/TypeaheadSingle',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p className="mb-0">
            To be able to use TypeaheadSingle, you have to add
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
    component: TypeaheadSingle
  }
};

const PredefinedOptionsStory = () => {
  const [value, setValue] = useState<Province | undefined>(
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
        valid={false}
      />

      {value ? <p>Your chosen province is: {value.label}</p> : null}
    </Card>
  );
};

export const PredefinedOptions = {
  render: PredefinedOptionsStory,
  name: 'predefined options'
};

const AsyncOptionsStory = () => {
  const [value, setValue] = useState<Province | undefined>(provinces()[0]);

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
};

export const AsyncOptions = {
  render: AsyncOptionsStory,
  name: 'async options'
};

const AsyncOptionsLimitedPageSizeStory = () => {
  const [value, setValue] = useState<Province | undefined>(
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
  const [value, setValue] = useState<Province | undefined>(
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
};

export const DisabledOptions = {
  render: DisabledOptionsStory,
  name: 'disabled options'
};

const CustomIsOptionEqualStory = () => {
  const [value, setValue] = useState<Province | undefined>(provinces()[0]);

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
};

export const CustomIsOptionEqual = {
  render: CustomIsOptionEqualStory,
  name: 'custom isOptionEqual'
};

const UsingReloadOptionsStory = () => {
  const [brand, setBrand] = useState<string>();
  const [model, setModel] = useState<string>();

  const allOptions = {
    Audi: ['A1', 'A2', 'A3', 'M5'],
    BMW: ['series 1', 'series 2', 'series 3', 'series 4', 'series 5'],
    Mercedes: ['Viano', 'Vito', 'Sprinter']
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
        options={() => resolveAfter(pageOf(brand ? allOptions[brand] : [], 1))}
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
};

export const UsingReloadOptions = {
  render: UsingReloadOptionsStory,
  name: 'using reloadOptions'
};

const AllowNewStory = () => {
  const [brand, setBrand] = useState<string>();

  const brands = ['Audi', 'BMW', 'Mercedes', 'Tesla'];

  return (
    <Card className="m-2">
      <TypeaheadSingle<string>
        id="brand"
        label="Brand"
        placeholder="Please select your brand or add a new one"
        options={() => resolveAfter(pageOf(brands, 1))}
        labelForOption={(option) => option}
        onChange={(chosenBrand) =>
          setBrand(
            chosenBrand && isTypeaheadCustomOption(chosenBrand)
              ? chosenBrand.label
              : chosenBrand
          )
        }
        value={brand}
        allowNew={true}
      />

      {brand ? <p>Your chosen brand is: {brand}</p> : null}
      <p>Available brands are: {brands.join(', ')}</p>
    </Card>
  );
};

export const AllowNew = {
  render: AllowNewStory,
  name: 'allow new'
};

const LabelPlaceholderStory = () => {
  const [value, setValue] = useState<Province | undefined>(
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
        <FieldTypeaheadSingle
          id="province"
          name="province"
          label="Province"
          placeholder="Please select your province"
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
        <JarbTypeaheadSingle
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
};

export const Jarb = {
  JarbStory,
  name: 'jarb'
};
