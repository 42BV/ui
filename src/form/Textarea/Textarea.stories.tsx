import React from 'react';
import { action } from '@storybook/addon-actions';

import { FieldTextarea, JarbTextarea, Textarea } from './Textarea';
import {
  FieldFormElementDependencies,
  FinalForm,
  JarbFormElementDependencies
} from '../../story-utils';
import { Alert } from 'reactstrap';
import { Card } from '../../core/Card/Card';
import { Tooltip } from '../../core/Tooltip/Tooltip';
import { Icon } from '../../core/Icon';

export default {
  title: 'Form/Textarea',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p>
            To be able to use Textarea, you have to add react-textarea-autosize
            to your dependencies:
          </p>
          <code>npm install --save react-textarea-autosize</code>
        </Alert>
        <Story />
      </>
    )
  ],

  parameters: {
    component: Textarea
  }
};

const BasicStory = () => {
  return (
    <Card className="m-2">
      <Textarea
        id="description"
        label="Description"
        placeholder="Please add a description"
        onChange={(value) => action(`onChange: ${value}`)}
      />
    </Card>
  );
};

export const Basic = {
  render: BasicStory,
  name: 'basic'
};

const WithoutPlaceholderStory = () => {
  return (
    <Card className="m-2">
      <Textarea
        id="description"
        label="Description"
        onChange={(value) => action(`onChange: ${value}`)}
      />
    </Card>
  );
};

export const WithoutPlaceholder = {
  render: WithoutPlaceholderStory,
  name: 'without placeholder'
};

const InvisibleLabelStory = () => {
  return (
    <Card className="m-2">
      <Textarea
        id="description"
        label="Description"
        hiddenLabel={true}
        placeholder="Please add a description"
        onChange={(value) => action(`onChange: ${value}`)}
      />
    </Card>
  );
};

export const InvisibleLabel = {
  render: InvisibleLabelStory,
  name: 'invisible label'
};

const WithCustomLabelStory = () => {
  return (
    <Card className="m-2">
      <Textarea
        id="description"
        label={
          <div className="d-flex justify-content-between">
            <span>Description</span>
            <Tooltip
              className="ms-1"
              content="The description is shown inside a tooltip"
            >
              <Icon icon="info" />
            </Tooltip>
          </div>
        }
        placeholder="Please add a description"
        onChange={(value) => action(`onChange: ${value}`)}
      />
    </Card>
  );
};

export const WithCustomLabel = {
  render: WithCustomLabelStory,
  name: 'with custom label'
};

const FieldStory = () => {
  return (
    <>
      <FieldFormElementDependencies />
      <FinalForm>
        <FieldTextarea
          id="description"
          name="description"
          label="Description"
          placeholder="Please add a description"
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
        <JarbTextarea
          id="description"
          name="description"
          placeholder="Please add a description"
          jarb={{
            validator: 'Hero.description',
            label: 'Description'
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
