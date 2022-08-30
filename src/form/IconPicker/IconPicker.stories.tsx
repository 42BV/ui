import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { FieldIconPicker, IconPicker, JarbIconPicker } from './IconPicker';
import { FieldFormElementDependencies, FinalForm, JarbFormElementDependencies } from '../../story-utils';
import { Card, Icon, IconType, Tooltip } from '../../';
import { Alert } from 'reactstrap';

function is3DRotation(value: IconType) {
  return value === '3d_rotation' ? undefined : 'Not "3d_rotation"';
}

storiesOf('Form/IconPicker', module)
  .addParameters({ component: IconPicker })
  .addDecorator((Story) => (
    <>
      <Alert color="warning" className="mb-4">
        <p>To be able to use IconPicker, you have to add rc-tooltip to your dependencies:</p>
        <code>npm install --save rc-tooltip</code>
      </Alert>
      <p className="mb-0 mt-2">You also have to add the stylesheet to your project</p>
      <code>@import &apos;rc-tooltip/assets/bootstrap.css&apos;;</code>
      <Story />
    </>
  ))
  .add('basic', () => {
    const [ value, setValue ] = useState<IconType | undefined>(undefined);

    return (
      <div>
        <Card className="m-2">
          <IconPicker
            id="icon"
            label="Icon"
            placeholder="Please select your icon"
            value={value}
            onChange={setValue}
          />
        </Card>
      </div>
    );
  })
  .add('invisible label', () => {
    const [ value, setValue ] = useState<IconType | undefined>(undefined);

    return (
      <Card className="m-2">
        <IconPicker
          id="icon"
          label="Icon"
          hiddenLabel={true}
          placeholder="Please select your icon"
          value={value}
          onChange={setValue}
        />
      </Card>
    );
  })
  .add('with custom label', () => {
    const [ value, setValue ] = useState<IconType | undefined>(undefined);

    return (
      <div>
        <Card className="m-2">
          <IconPicker
            id="icon"
            label={
              <div className="d-flex justify-content-between">
                <span>Icon</span>
                <Tooltip
                  className="ms-1"
                  content="The icon will be used as an avatar"
                >
                  <Icon icon="info" />
                </Tooltip>
              </div>
            }
            placeholder="Please select your icon"
            value={value}
            onChange={setValue}
          />
        </Card>
      </div>
    );
  })
  .add('with icon', () => {
    const [ value, setValue ] = useState<IconType | undefined>(undefined);

    return (
      <div>
        <Card className="m-2">
          <IconPicker
            id="icon"
            label="Icon"
            placeholder="Please select your icon"
            icon="colorize"
            value={value}
            onChange={setValue}
          />
        </Card>
      </div>
    );
  })
  .add('without clear button', () => {
    const [ value, setValue ] = useState<IconType | undefined>(undefined);

    return (
      <div>
        <Card className="m-2">
          <IconPicker
            id="icon"
            label="Icon"
            placeholder="Please select your icon"
            value={value}
            onChange={setValue}
            canClear={false}
          />
        </Card>
      </div>
    );
  })
  .add('field', () => {
    return (
      <>
        <FieldFormElementDependencies />
        <FinalForm>
          <FieldIconPicker
            id="icon"
            name="icon"
            label="Icon"
            placeholder="Please select your icon"
            validators={[ is3DRotation ]}
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
          <JarbIconPicker
            id="icon"
            name="icon"
            placeholder="Please select your icon"
            validators={[ is3DRotation ]}
            jarb={{
              validator: 'Hero.icon',
              label: 'Icon'
            }}
          />
        </FinalForm>
      </>
    );
  });
