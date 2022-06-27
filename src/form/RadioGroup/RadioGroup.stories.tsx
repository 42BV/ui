import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { JarbRadioGroup, RadioGroup } from './RadioGroup';
import {
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
} from '../story-utils';
import { Card } from '../../core/Card/Card';
import { pageOf } from '../../utilities/page/page';
import { Tooltip } from '../../core/Tooltip/Tooltip';
import { Icon } from '../../core/Icon';

storiesOf('Form/RadioGroup', module)
  .addParameters({ component: RadioGroup })
  .add('predefined options', () => {
    const [ value, setValue ] = useState<Province | undefined>(
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
  })
  .add('async options', () => {
    const [ value, setValue ] = useState<Province | undefined>(provinces()[0]);

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
          <strong>Disclaimer:</strong> when using async, a maximum of 100
          options will be displayed. If you want to display more than 100
          options, you should use the ModalPickerSingle.
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
  })
  .add('custom isOptionEqual', () => {
    const [ value, setValue ] = useState<Province | undefined>(provinces()[0]);

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
  })
  .add('custom keyForOption', () => {
    const [ value, setValue ] = useState<Province | undefined>(provinces()[0]);

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
  .add('label & placeholder', () => {
    const [ value, setValue ] = useState<Province | undefined>(
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
  })
  .add('horizontal', () => {
    const [ value, setValue ] = useState<Province | undefined>(
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
  })
  .add('horizontal with clear', () => {
    const [ value, setValue ] = useState<Province | undefined>(
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
  })
  .add('with clear button', () => {
    const [ value, setValue ] = useState<Province | undefined>(
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
  })

  .add('jarb', () => {
    return (
      <>
        <JarbFormElementDependencies />
        <FinalForm>
          <JarbRadioGroup
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
