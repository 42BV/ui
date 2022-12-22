import React, { useState } from 'react';

import { FieldRadioGroup, JarbRadioGroup, RadioGroup } from './RadioGroup';
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
} from '../../story-utils';
import { Card } from '../../core/Card/Card';
import { pageOf } from '../../utilities/page/page';
import { Tooltip } from '../../core/Tooltip/Tooltip';
import { Icon } from '../../core/Icon';

export default {
  title: 'Form/RadioGroup',

  parameters: {
    component: RadioGroup
  }
};

const PredefinedOptionsStory = () => {
  const [value, setValue] = useState<Province | undefined>(
    nonExistingProvince()
  );

  return (
    <Card className="m-2">
      <RadioGroup<Province>
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
};

export const PredefinedOptions = {
  render: PredefinedOptionsStory,
  name: 'predefined options'
};

const AsyncOptionsStory = () => {
  const [value, setValue] = useState<Province | undefined>(provinces()[0]);

  return (
    <Card className="m-2">
      <RadioGroup<Province>
        id="province"
        label="Province"
        placeholder="Please select your province"
        options={provinceFetcher}
        labelForOption={(province) => province.label}
        value={value}
        onChange={setValue}
      />

      {value ? <p>Your chosen province is: {value.label}</p> : null}

      <p className="mt-3">
        <strong>Disclaimer:</strong> when using async, a maximum of 100 options
        will be displayed. If you want to display more than 100 options, you
        should use the ModalPickerSingle.
      </p>
    </Card>
  );
};

export const AsyncOptions = {
  render: AsyncOptionsStory,
  name: 'async options'
};

const DisabledOptionsStory = () => {
  const [value, setValue] = useState<Province | undefined>(
    nonExistingProvince()
  );

  return (
    <Card className="m-2">
      <RadioGroup<Province>
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
      <RadioGroup<Province>
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

const CustomKeyForOptionStory = () => {
  const [value, setValue] = useState<Province | undefined>(provinces()[0]);

  return (
    <Card className="m-2">
      <RadioGroup<Province>
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
};

export const CustomKeyForOption = {
  render: CustomKeyForOptionStory,
  name: 'custom keyForOption'
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
      <RadioGroup
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
      <RadioGroup
        id="model"
        label="Model"
        placeholder={
          brand ? 'Please select your model' : 'Please select a brand first'
        }
        options={() => resolveAfter(pageOf(brand ? allOptions[brand] : [], 1))}
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
};

export const UsingReloadOptions = {
  render: UsingReloadOptionsStory,
  name: 'using reloadOptions'
};

const LabelPlaceholderStory = () => {
  const [value, setValue] = useState<Province | undefined>(
    nonExistingProvince()
  );

  return (
    <Card className="m-2">
      <span className="d-block fs-5">Invisible label</span>

      <RadioGroup<Province>
        label="Province"
        hiddenLabel={true}
        placeholder="Please select your province"
        options={provinces()}
        labelForOption={(province) => province.label}
        value={value}
        onChange={setValue}
      />

      <hr />

      <span className="d-block fs-5">Custom label</span>

      <RadioGroup<Province>
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

      <span className="d-block fs-5">Without placeholder</span>

      <RadioGroup<Province>
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

const HorizontalStory = () => {
  const [value, setValue] = useState<Province | undefined>(
    nonExistingProvince()
  );

  return (
    <Card className="m-2">
      <RadioGroup<Province>
        id="province"
        label="Province"
        placeholder="Please select your province"
        options={provinces()}
        labelForOption={(province) => province.label}
        value={value}
        onChange={setValue}
        horizontal={true}
      />

      {value ? <p>Your chosen province is: {value.label}</p> : null}

      <p>
        <strong>Disclaimer:</strong> horizontal mode works best when there are
        not too many items
      </p>
    </Card>
  );
};

export const Horizontal = {
  render: HorizontalStory,
  name: 'horizontal'
};

const HorizontalWithClearStory = () => {
  const [value, setValue] = useState<Province | undefined>(
    nonExistingProvince()
  );

  return (
    <Card className="m-2">
      <RadioGroup<Province>
        id="province"
        label="Province"
        placeholder="Please select your province"
        options={provinces()}
        labelForOption={(province) => province.label}
        value={value}
        onChange={setValue}
        horizontal={true}
        canClear={true}
      />

      {value ? <p>Your chosen province is: {value.label}</p> : null}

      <p>
        <strong>Disclaimer:</strong> horizontal mode works best when there are
        not too many items
      </p>
    </Card>
  );
};

export const HorizontalWithClear = {
  render: HorizontalWithClearStory,
  name: 'horizontal with clear'
};

const WithClearButtonStory = () => {
  const [value, setValue] = useState<Province | undefined>(
    nonExistingProvince()
  );

  return (
    <Card className="m-2">
      <RadioGroup<Province>
        id="province"
        label="Province"
        placeholder="Please select your province"
        options={provinces()}
        labelForOption={(province) => province.label}
        value={value}
        onChange={setValue}
        canClear={true}
      />

      {value ? <p>Your chosen province is: {value.label}</p> : null}
    </Card>
  );
};

export const WithClearButton = {
  render: WithClearButtonStory,
  name: 'with clear button'
};

const FieldStory = () => {
  return (
    <>
      <FieldFormElementDependencies />
      <FinalForm>
        <FieldRadioGroup
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
        <JarbRadioGroup
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
  render: JarbStory,
  name: 'jarb'
};
