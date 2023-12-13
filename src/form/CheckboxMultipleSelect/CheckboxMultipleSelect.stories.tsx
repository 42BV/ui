import { useState } from 'react';
import { storiesOf } from '@storybook/react';

import {
  CheckboxMultipleSelect,
  FieldCheckboxMultipleSelect,
  JarbCheckboxMultipleSelect
} from './CheckboxMultipleSelect';
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
  ReloadOptionsInfo
} from '../../story-utils';
import { Alert } from 'reactstrap';
import { Card } from '../../card/Card/Card';
import { Toggle } from '../../core/Toggle/Toggle';
import { Tooltip } from '../../core/Tooltip/Tooltip';
import { Icon } from '../../core/Icon';

storiesOf('Form/CheckboxMultipleSelect', module)
  .addParameters({ component: CheckboxMultipleSelect })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p>
          To be able to use CheckboxMultipleSelect, you have to add lodash to
          your dependencies:
        </p>
        <code>npm install --save lodash</code>
      </Alert>
      <Story />
    </>
  ))
  .add('predefined options', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Card className="m-2">
        <CheckboxMultipleSelect
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
        <CheckboxMultipleSelect
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

        <p className="mt-3">
          <strong>Disclaimer:</strong> when using async, a maximum of 100
          options will be displayed. If you want to display more than 100
          options, you should use the ModalPickerMultiple.
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
        <CheckboxMultipleSelect
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
        <CheckboxMultipleSelect
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
  .add('custom keyForOption', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      provinces()[0]
    ]);

    return (
      <Card className="m-2">
        <CheckboxMultipleSelect
          id="provinces"
          label="Provinces"
          placeholder="Please select your provinces"
          options={provinces()}
          labelForOption={(province) => province.label}
          keyForOption={(province) => province.value}
          value={value}
          onChange={setValue}
        />

        {value ? (
          <p>
            Your chosen provinces are:{' '}
            {value.map((province) => province.label).join(', ')}
          </p>
        ) : null}

        <KeyForOptionInfo />
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
          <Toggle
            label="Limit to northern provinces"
            className="ms-2"
            color="primary"
            value={limitToNorthern}
            onChange={() => setLimitToNorthern(!limitToNorthern)}
          />
        </p>

        <CheckboxMultipleSelect
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
  .add('optionsShouldAlwaysContainValue', () => {
    const permissions = [
      'CREATE_CAR',
      'UPDATE_CAR',
      'READ_CAR',
      'DELETE_CAR',

      'CREATE_BIKE',
      'UPDATE_BIKE',
      'READ_BIKE',
      'DELETE_BIKE',

      'CREATE_BOAT',
      'UPDATE_BOAT',
      'READ_BOAT',
      'DELETE_BOAT'
    ] as const;

    type Permission = (typeof permissions)[number];

    function carPermissions(): Permission[] {
      return ['CREATE_CAR', 'UPDATE_CAR', 'READ_CAR', 'DELETE_CAR'];
    }

    function bikePermissions(): Permission[] {
      return ['CREATE_BIKE', 'UPDATE_BIKE', 'READ_BIKE', 'DELETE_BIKE'];
    }

    function boatPermissions(): Permission[] {
      return ['CREATE_BOAT', 'UPDATE_BOAT', 'READ_BOAT', 'DELETE_BOAT'];
    }

    const [value, setValue] = useState<Permission[] | undefined>([
      'CREATE_CAR',
      'CREATE_BIKE',
      'CREATE_BOAT'
    ]);

    return (
      <Card className="m-2">
        <CheckboxMultipleSelect
          key="car"
          id="carPermission"
          label="Car permissions"
          placeholder="Please select your car permissions"
          options={carPermissions()}
          labelForOption={(permission) => permission}
          optionsShouldAlwaysContainValue={false}
          value={value}
          onChange={setValue}
        />

        <CheckboxMultipleSelect
          key="bike"
          id="bikePermission"
          label="Bike permissions"
          placeholder="Please select your bike permissions"
          options={bikePermissions()}
          labelForOption={(permission) => permission}
          optionsShouldAlwaysContainValue={false}
          value={value}
          onChange={setValue}
        />

        <CheckboxMultipleSelect
          key="boat"
          id="boatPermission"
          label="Boat permissions"
          placeholder="Please select your boat permissions"
          options={boatPermissions()}
          labelForOption={(permission) => permission}
          optionsShouldAlwaysContainValue={false}
          value={value}
          onChange={setValue}
        />

        {value ? (
          <p>
            Your permissions are:{' '}
            {value.map((permissions) => permissions).join(', ')}
          </p>
        ) : null}

        <p>
          <strong>optionsShouldAlwaysContainValue</strong> determines whether or
          not the form element should always contain the value which is
          selected.
        </p>

        <p>
          It should be <strong>true</strong> when using it in the following
          situation: The form element receives a value which is no longer part
          of the options. In that case it is handy to have the value
          automatically added to the options, so the user still sees the select
          value.
        </p>

        <p>
          It should be <strong>false</strong> when using it in the following
          situations:
          <ol>
            <li>
              The selected `value` is displayed separately from the selection of
              values. In this case it does not make sense to add the `value` to
              the options because it is already displayed.
            </li>

            <li>
              The form element represents a sub selection of a larger value. For
              example you have an array of permissions of what the user can do
              in the system, visually you display grouped by parts of the
              domain. This means giving the same `value` to various form element
              components to represent parts of the same array of permissions. If
              `optionsShouldAlwaysContainValue` were `true` it would add all
              permissions to each permission group.
            </li>
          </ol>
        </p>

        <p>
          In the above example it is <strong>false</strong> because otherwise
          the selected CREATE options would appear in each form element, and not
          just the one for the group.
        </p>
      </Card>
    );
  })
  .add('label & placeholder', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <Card className="m-2">
        <span className="d-block fs-5">Invisible label</span>

        <CheckboxMultipleSelect
          label="Provinces"
          hiddenLabel={true}
          placeholder="Please select your provinces"
          options={provinces()}
          labelForOption={(province) => province.label}
          value={value}
          onChange={setValue}
        />

        <hr />

        <h3>Custom label</h3>

        <CheckboxMultipleSelect
          id="provinces"
          label={
            <div className="d-flex justify-content-between">
              <span>Friends</span>
              <Tooltip className="ms-1" content="Provinces are nice to have">
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

        <CheckboxMultipleSelect
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
  .add('horizontal', () => {
    const [value, setValue] = useState<Province[] | undefined>([
      nonExistingProvince()
    ]);

    return (
      <div>
        <Card className="m-2">
          <CheckboxMultipleSelect
            id="provinces"
            label="Provinces"
            placeholder="Please select your provinces"
            options={provinces()}
            labelForOption={(province) => province.label}
            value={value}
            onChange={setValue}
            horizontal={true}
          />

          {value ? (
            <p>
              Your chosen provinces are:{' '}
              {value.map((province) => province.label).join(', ')}
            </p>
          ) : null}

          <p>
            <strong>Disclaimer:</strong> horizontal mode works best when there
            are not too many items
          </p>
        </Card>
      </div>
    );
  })
  .add('field', () => {
    return (
      <>
        <FieldFormElementDependencies />
        <FinalForm>
          <FieldCheckboxMultipleSelect
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
  })
  .add('jarb', () => {
    return (
      <>
        <JarbFormElementDependencies />
        <FinalForm>
          <JarbCheckboxMultipleSelect
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
  });
