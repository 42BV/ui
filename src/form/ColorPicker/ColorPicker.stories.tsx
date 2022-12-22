import React, { useState } from 'react';

import { ColorPicker, FieldColorPicker, JarbColorPicker } from './ColorPicker';
import {
  FieldFormElementDependencies,
  FinalForm,
  JarbFormElementDependencies
} from '../../story-utils';
import { Alert } from 'reactstrap';
import { Card } from '../../core/Card/Card';
import { Tooltip } from '../../core/Tooltip/Tooltip';
import { Icon } from '../../core/Icon';

function isToDark(value?: string) {
  if (!value) {
    return undefined;
  }

  const c = value.substring(1); // strip #
  const rgb = parseInt(c, 16); // convert rgb to decimal
  const r = (rgb >> 16) & 0xff; // extract red
  const g = (rgb >> 8) & 0xff; // extract green
  const b = (rgb >> 0) & 0xff; // extract blue

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  if (luma < 40) {
    return 'This color is to dark';
  }

  return undefined;
}

export default {
  title: 'Form/ColorPicker',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p>
            To be able to use ColorPicker, you have to add react-color to your
            dependencies:
          </p>
          <code>npm install --save react-color</code>
        </Alert>
        <Story />
      </>
    )
  ],

  parameters: {
    component: ColorPicker
  }
};

const BasicStory = () => {
  const [value, setValue] = useState<string | undefined>();

  return (
    <div>
      <Card className="m-2">
        <ColorPicker
          id="color"
          label="Color"
          placeholder="Please select your favorite color"
          value={value}
          onChange={setValue}
        />
      </Card>
    </div>
  );
};

export const Basic = {
  render: BasicStory,
  name: 'basic'
};

const BasicPreselectedStory = () => {
  const [value, setValue] = useState<string | undefined>('#ff0000');

  return (
    <div>
      <Card className="m-2">
        <ColorPicker
          id="color"
          label="Color"
          placeholder="Please select your favorite color"
          value={value}
          onChange={setValue}
        />
      </Card>
    </div>
  );
};

export const BasicPreselected = {
  render: BasicPreselectedStory,
  name: 'basic preselected'
};

const WithCustomLabelStory = () => {
  const [value, setValue] = useState<string | undefined>();

  return (
    <div>
      <Card className="m-2">
        <ColorPicker
          id="color"
          label={
            <div className="d-flex justify-content-between">
              <span>Color</span>
              <Tooltip
                className="ms-1"
                content="Use the color picker to select a color"
              >
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Please select your favorite color"
          value={value}
          onChange={setValue}
        />
      </Card>
    </div>
  );
};

export const WithCustomLabel = {
  render: WithCustomLabelStory,
  name: 'with custom label'
};

const WithIconStory = () => {
  const [value, setValue] = useState<string | undefined>();

  return (
    <div>
      <Card className="m-2">
        <ColorPicker
          id="color"
          label="Color"
          placeholder="Please select your favorite color"
          icon="colorize"
          value={value}
          onChange={setValue}
        />
      </Card>
    </div>
  );
};

export const WithIcon = {
  render: WithIconStory,
  name: 'with icon'
};

const WithoutClearButtonStory = () => {
  const [value, setValue] = useState<string | undefined>('#ff0000');

  return (
    <div>
      <Card className="m-2">
        <ColorPicker
          id="color"
          label="Color"
          placeholder="Please select your favorite color"
          value={value}
          onChange={setValue}
          canClear={false}
        />
      </Card>
    </div>
  );
};

export const WithoutClearButton = {
  render: WithoutClearButtonStory,
  name: 'without clear button'
};

const FieldStory = () => {
  return (
    <>
      <FieldFormElementDependencies />
      <FinalForm>
        <FieldColorPicker
          id="color"
          name="color"
          label="Color"
          placeholder="Please select your favorite color"
          validators={[isToDark]}
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
        <JarbColorPicker
          id="color"
          name="color"
          placeholder="Please select your favorite color"
          validators={[isToDark]}
          jarb={{
            validator: 'Hero.color',
            label: 'Color'
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
