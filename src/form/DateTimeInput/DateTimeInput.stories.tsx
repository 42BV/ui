import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import DateTimeInput, { JarbDateTimeInput } from './DateTimeInput';
import { FinalForm, Form } from '../story-utils';
import { Icon, Tooltip } from '../..';

storiesOf('Form|DateTime/DateTimeInput', module)
  .add('date and time', () => {
    return (
      <Form>
        <DateTimeInput
          id="dateOfBirth"
          label="Date of birth"
          placeholder="Please enter your date and time of birth"
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
          id="dateOfBirth"
          label="Date of birth"
          placeholder="Please enter your date of birth"
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
  .add('with custom label', () => {
    return (
      <Form>
        <DateTimeInput
          id="dateOfBirth"
          label={
            <>
              <span>Date of birth</span>
              <Tooltip
                className="position-relative ml-1"
                style={{ top: 5 }}
                content="This is the date you where born on"
              >
                <Icon icon="info" />
              </Tooltip>
            </>
          }
          placeholder="Please enter your date and time of birth"
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
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbDateTimeInput
          id="dateOfBirth"
          name="dateOfBirth"
          label="Date of birth"
          placeholder="Please enter your date and time of birth"
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
