import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Textarea, { JarbTextarea } from './Textarea';
import { FinalForm } from '../story-utils';
import { Tooltip, Icon, Card } from '../..';

storiesOf('Form/Textarea', module)
  .add('basic', () => {
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
  })
  .add('without placeholder', () => {
    return (
      <Card className="m-2">
        <Textarea
          id="description"
          label="Description"
          onChange={(value) => action(`onChange: ${value}`)}
        />
      </Card>
    );
  })
  .add('without label', () => {
    return (
      <Card className="m-2">
        <Textarea
          id="description"
          placeholder="Please add a description"
          onChange={(value) => action(`onChange: ${value}`)}
        />
      </Card>
    );
  })
  .add('with custom label', () => {
    return (
      <Card className="m-2">
        <Textarea
          id="description"
          label={
            <div className="d-flex justify-content-between">
              <span>Description</span>
              <Tooltip
                className="ml-1"
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
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbTextarea
          id="description"
          name="description"
          label="Description"
          placeholder="Please add a description"
          jarb={{
            validator: 'Hero.description',
            label: 'Description'
          }}
        />
      </FinalForm>
    );
  });
