import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import IconPicker, { JarbIconPicker } from './IconPicker';
import { FinalForm } from '../story-utils';
import { IconType, Tooltip, Icon, Card } from '../../';

function is3DRotation(value: IconType) {
  return value === '3d_rotation' ? undefined : 'Not "3d_rotation"';
}

storiesOf('Form/IconPicker', module)
  .add('basic', () => {
    const [value, setValue] = useState<IconType | undefined>(undefined);

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
  .add('without label', () => {
    const [value, setValue] = useState<IconType | undefined>(undefined);

    return (
      <Card className="m-2">
        <IconPicker
          id="icon"
          placeholder="Please select your icon"
          value={value}
          onChange={setValue}
        />
      </Card>
    );
  })
  .add('with custom label', () => {
    const [value, setValue] = useState<IconType | undefined>(undefined);

    return (
      <div>
        <Card className="m-2">
          <IconPicker
            id="icon"
            label={
              <div className="d-flex justify-content-between">
                <span>Icon</span>
                <Tooltip
                  className="ml-1"
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
    const [value, setValue] = useState<IconType | undefined>(undefined);

    return (
      <div>
        <Card className="m-2">
          <IconPicker
            id="icon"
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
    const [value, setValue] = useState<IconType | undefined>(undefined);

    return (
      <div>
        <Card className="m-2">
          <IconPicker
            id="icon"
            placeholder="Please select your icon"
            value={value}
            onChange={setValue}
            canClear={false}
          />
        </Card>
      </div>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbIconPicker
          id="icon"
          name="icon"
          label="Icon"
          placeholder="Please select your icon"
          validators={[is3DRotation]}
          jarb={{
            validator: 'Hero.icon',
            label: 'Icon'
          }}
        />
      </FinalForm>
    );
  });
