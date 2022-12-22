import React, { useState } from 'react';
import { Alert } from 'reactstrap';

import { Checkbox, FieldCheckbox, JarbCheckbox } from './Checkbox';
import {
  FieldFormElementDependencies,
  FinalForm,
  JarbFormElementDependencies
} from '../../story-utils';

import { Icon } from '../../core/Icon';
import { Tooltip } from '../../core/Tooltip/Tooltip';
import { Card } from '../../core/Card/Card';

function isSClass(value?: boolean) {
  if (value !== false) {
    return undefined;
  }

  return 'Hero must be S class to proceed';
}

export default {
  title: 'Form/Checkbox',

  parameters: {
    component: Checkbox
  }
};

const BasicStory = () => {
  const [isSClass, setIsSClass] = useState<boolean | undefined>(undefined);

  return (
    <Card className="m-2">
      <Checkbox
        id="isSClass"
        label="Is S class hero"
        placeholder="Whether or not the hero is S class"
        value={isSClass}
        onChange={setIsSClass}
      />

      {isSClass ? (
        <Alert color="success" className="d-flex">
          <Icon icon="warning" className="me-1" /> This hero is of the highest
          caliber
        </Alert>
      ) : null}
    </Card>
  );
};

export const Basic = {
  render: BasicStory,
  name: 'basic'
};

const BasicWithIndeterminateStory = () => {
  const [isSClass, setIsSClass] = useState<boolean | undefined>(undefined);

  return (
    <Card className="m-2">
      <Checkbox
        id="isSClass"
        label="Is S class hero"
        placeholder="Whether or not the hero is S class"
        value={isSClass}
        onChange={setIsSClass}
        allowIndeterminate={true}
      />

      {isSClass ? (
        <Alert color="success" className="d-flex">
          <Icon icon="warning" className="me-1" /> This hero is of the highest
          caliber
        </Alert>
      ) : null}
    </Card>
  );
};

export const BasicWithIndeterminate = {
  render: BasicWithIndeterminateStory,
  name: 'basic with indeterminate'
};

const WithoutPlaceholderStory = () => {
  const [isSClass, setIsSClass] = useState<boolean | undefined>(undefined);

  return (
    <Card className="m-2">
      <Checkbox
        id="isSClass"
        label="Is S class hero"
        value={isSClass}
        onChange={setIsSClass}
      />

      {isSClass ? (
        <Alert color="success" className="d-flex">
          <Icon icon="warning" className="me-1" /> This hero is of the highest
          caliber
        </Alert>
      ) : null}
    </Card>
  );
};

export const WithoutPlaceholder = {
  render: WithoutPlaceholderStory,
  name: 'without placeholder'
};

const WithCustomLabelStory = () => {
  const [isSClass, setIsSClass] = useState<boolean | undefined>(undefined);

  return (
    <Card className="m-2">
      <Checkbox
        id="isSClass"
        label={
          <div className="d-flex justify-content-between">
            <span>Is S class hero</span>
            <Tooltip
              className="ms-1"
              content="An S class hero is a hero of the highest caliber"
            >
              <Icon icon="info" />
            </Tooltip>
          </div>
        }
        placeholder="Whether or not the hero is S class"
        value={isSClass}
        onChange={setIsSClass}
      />

      {isSClass ? (
        <Alert color="success" className="d-flex">
          <Icon icon="warning" className="me-1" /> This hero is of the highest
          caliber
        </Alert>
      ) : null}
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
        <FieldCheckbox
          id="isSClass"
          name="isSClass"
          label="Is S class hero"
          placeholder="Whether or not the hero is S class"
          validators={[isSClass]}
        />
      </FinalForm>
    </>
  );
};

export const Field = {
  render: FieldStory,
  name: 'field'
};

const FieldWithIndeterminateStory = () => {
  return (
    <>
      <FieldFormElementDependencies />
      <FinalForm>
        <FieldCheckbox
          id="isSClass"
          name="isSClass"
          label="Is S class hero"
          placeholder="Whether or not the hero is S class"
          validators={[isSClass]}
          allowIndeterminate={true}
        />
      </FinalForm>
    </>
  );
};

export const FieldWithIndeterminate = {
  render: FieldWithIndeterminateStory,
  name: 'field with indeterminate'
};

const JarbStory = () => {
  return (
    <>
      <JarbFormElementDependencies />
      <FinalForm>
        <JarbCheckbox
          id="isSClass"
          name="isSClass"
          placeholder="Whether or not the hero is S class"
          validators={[isSClass]}
          jarb={{
            validator: 'Hero.isSClass',
            label: 'Is S class hero'
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

const JarbWithIndeterminateStory = () => {
  return (
    <>
      <JarbFormElementDependencies />
      <FinalForm>
        <JarbCheckbox
          id="isSClass"
          name="isSClass"
          placeholder="Whether or not the hero is S class"
          validators={[isSClass]}
          jarb={{
            validator: 'Hero.isSClass',
            label: 'Is S class hero'
          }}
          allowIndeterminate={true}
        />
      </FinalForm>
    </>
  );
};

export const JarbWithIndeterminate = {
  render: JarbWithIndeterminateStory,
  name: 'jarb with indeterminate'
};
