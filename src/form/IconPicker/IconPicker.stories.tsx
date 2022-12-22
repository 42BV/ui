import React, { useState } from 'react';

import { FieldIconPicker, IconPicker, JarbIconPicker } from './IconPicker';
import {
  FieldFormElementDependencies,
  FinalForm,
  JarbFormElementDependencies
} from '../../story-utils';
import { Card, Icon, IconType, Tooltip } from '../../';
import { Alert } from 'reactstrap';

function is3DRotation(value: IconType) {
  return value === '3d_rotation' ? undefined : 'Not "3d_rotation"';
}

export default {
  title: 'Form/IconPicker',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p className="mb-0">
            To be able to use IconPicker, you have to add @tippyjs/react to your
            dependencies:
          </p>
          <code>npm install --save @tippyjs/react</code>
          <p className="mb-0 mt-2">
            You also have to add the stylesheet to your project
          </p>
          <code>@import &apos;tippy.js/dist/tippy.css&apos;;</code>
        </Alert>
        <Story />
      </>
    )
  ],

  parameters: {
    component: IconPicker
  }
};

const BasicStory = () => {
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
};

export const Basic = {
  render: BasicStory,
  name: 'basic'
};

const InvisibleLabelStory = () => {
  const [value, setValue] = useState<IconType | undefined>(undefined);

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
};

export const InvisibleLabel = {
  render: InvisibleLabelStory,
  name: 'invisible label'
};

const WithCustomLabelStory = () => {
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
};

export const WithCustomLabel = {
  render: WithCustomLabelStory,
  name: 'with custom label'
};

const WithIconStory = () => {
  const [value, setValue] = useState<IconType | undefined>(undefined);

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
};

export const WithIcon = {
  render: WithIconStory,
  name: 'with icon'
};

const WithoutClearButtonStory = () => {
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
        <FieldIconPicker
          id="icon"
          name="icon"
          label="Icon"
          placeholder="Please select your icon"
          validators={[is3DRotation]}
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
        <JarbIconPicker
          id="icon"
          name="icon"
          placeholder="Please select your icon"
          validators={[is3DRotation]}
          jarb={{
            validator: 'Hero.icon',
            label: 'Icon'
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
