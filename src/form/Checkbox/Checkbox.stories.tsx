import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { Alert } from 'reactstrap';

import Checkbox, { JarbCheckbox } from './Checkbox';
import { FinalForm, Form } from '../story-utils';

import { Icon } from '../../core/Icon';

function isSClass(value?: boolean) {
  if (value !== false) {
    return undefined;
  }

  return 'Hero must be S class to proceed';
}

storiesOf('Form|Checkbox', module)
  .add('basic', () => {
    const [isSClass, setIsSClass] = useState<boolean | undefined>(undefined);

    return (
      <Form>
        <Checkbox
          id="isSClass"
          label="Is S class hero"
          placeholder="Whether or not the hero is S class"
          value={isSClass}
          onChange={setIsSClass}
        />

        {isSClass ? (
          <Alert color="success" className="d-flex">
            <Icon icon="warning" className="mr-1" /> This hero is of the highest
            caliber
          </Alert>
        ) : null}
      </Form>
    );
  })
  .add('basic with indeterminate', () => {
    const [isSClass, setIsSClass] = useState<boolean | undefined>(undefined);

    return (
      <Form>
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
            <Icon icon="warning" className="mr-1" /> This hero is of the highest
            caliber
          </Alert>
        ) : null}
      </Form>
    );
  })
  .add('sans placeholder', () => {
    const [isSClass, setIsSClass] = useState<boolean | undefined>(undefined);

    return (
      <Form>
        <Checkbox
          id="isSClass"
          label="Is S class hero"
          value={isSClass}
          onChange={setIsSClass}
        />

        {isSClass ? (
          <Alert color="success" className="d-flex">
            <Icon icon="warning" className="mr-1" /> This hero is of the highest
            caliber
          </Alert>
        ) : null}
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbCheckbox
          id="isSClass"
          name="isSClass"
          label="Is S class hero"
          placeholder="Whether or not the hero is S class"
          validators={[isSClass]}
          jarb={{
            validator: 'Hero.isSClass',
            label: 'Description'
          }}
        />
      </FinalForm>
    );
  })
  .add('jarb with indeterminate', () => {
    return (
      <FinalForm>
        <JarbCheckbox
          id="isSClass"
          name="isSClass"
          label="Is S class hero"
          placeholder="Whether or not the hero is S class"
          validators={[isSClass]}
          jarb={{
            validator: 'Hero.isSClass',
            label: 'Description'
          }}
          allowIndeterminate={true}
        />
      </FinalForm>
    );
  });
