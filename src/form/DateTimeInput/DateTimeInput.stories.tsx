import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import DateTimeInput, { JarbDateTimeInput } from './DateTimeInput';
import { Form, FinalForm } from '../story-utils';

storiesOf('Form|DateTime/DateTimeInput', module)
  .add('date and time', () => {
    return (
      <Form>
        <DateTimeInput
          id="birthdate"
          label="Birthdate"
          placeholder="Please enter your birthdate and time"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm:ss"
          isDateAllowed={date => {
            return date.isBefore(new Date());
          }}
          onChange={() => action('value changed')}
        />
      </Form>
    );
  })
  .add('date', () => {
    return (
      <Form>
        <DateTimeInput
          id="birthdate"
          label="Birthdate"
          placeholder="Please enter your birthdate"
          dateFormat="YYYY-MM-DD"
          timeFormat={false}
          isDateAllowed={date => {
            return date.isBefore(new Date());
          }}
          onChange={() => action('value changed')}
        />
      </Form>
    );
  })
  .add('time', () => {
    return (
      <Form>
        <DateTimeInput
          id="startTime"
          label="Start time"
          placeholder="Please enter your start time"
          dateFormat={false}
          timeFormat="HH:mm:ss"
          isDateAllowed={date => {
            return date.isBefore(new Date());
          }}
          onChange={() => action('value changed')}
        />
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbDateTimeInput
          id="birthdate"
          name="birthdate"
          label="Birthdate"
          placeholder="Please enter your birthdate and time"
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm:ss"
          isDateAllowed={date => {
            return date.isBefore(new Date());
          }}
          jarb={{
            validator: 'User.birthday',
            label: 'Birthday'
          }}
        />
      </FinalForm>
    );
  });
