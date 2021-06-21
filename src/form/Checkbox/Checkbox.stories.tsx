import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { Alert } from 'reactstrap';

import Checkbox, { JarbCheckbox } from './Checkbox';
import { FinalForm } from '../story-utils';

import { Icon } from '../../core/Icon';
import Tooltip from '../../core/Tooltip/Tooltip';
import { Card } from '../../core/Card/Card';

function isSClass(value?: boolean) {
  if (value !== false) {
    return undefined;
  }

  return 'Hero must be S class to proceed';
}

storiesOf('Form/Checkbox', module)
  .add('basic', () => {
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
            <Icon icon="warning" className="mr-1" /> This hero is of the highest
            caliber
          </Alert>
        ) : null}
      </Card>
    );
  })
  .add('basic with indeterminate', () => {
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
            <Icon icon="warning" className="mr-1" /> This hero is of the highest
            caliber
          </Alert>
        ) : null}
      </Card>
    );
  })
  .add('without placeholder', () => {
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
            <Icon icon="warning" className="mr-1" /> This hero is of the highest
            caliber
          </Alert>
        ) : null}
      </Card>
    );
  })
  .add('with custom label', () => {
    const [isSClass, setIsSClass] = useState<boolean | undefined>(undefined);

    return (
      <Card className="m-2">
        <Checkbox
          id="isSClass"
          label={
            <div className="d-flex justify-content-between">
              <span>Is S class hero</span>
              <Tooltip
                className="ml-1"
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
            <Icon icon="warning" className="mr-1" /> This hero is of the highest
            caliber
          </Alert>
        ) : null}
      </Card>
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
