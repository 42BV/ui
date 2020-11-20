import React, { useState } from 'react';
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
  .add('open in modal', () => {
    const [value, setValue] = useState();

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
          value={value}
          onChange={setValue}
          mode="modal"
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
          placeholder="Please enter your date of birth"
          dateFormat="DD-MM-YYYY"
          timeFormat={false}
          isDateAllowed={date => {
            return date.isBefore(new Date());
          }}
          jarb={{
            validator: 'User.birthday',
            label: 'Birthday'
          }}
        />

        <JarbDateTimeInput
          id="weddingDay"
          name="weddingDay"
          label="Wedding day"
          placeholder="Please enter your wedding day"
          dateFormat="DD-MM-YYYY"
          timeFormat={false}
          isDateAllowed={date => {
            return date.isAfter(new Date());
          }}
          mode="modal"
          jarb={{
            validator: 'User.weddingDay',
            label: 'Weddingday'
          }}
        />

        <JarbDateTimeInput
          id="sunset"
          name="sunset"
          label="Sunset"
          placeholder="Please enter the time the sun sets"
          dateFormat={false}
          timeFormat="HH:mm:ss"
          isDateAllowed={date => {
            return date.isBefore(new Date());
          }}
          jarb={{
            validator: 'User.sunset',
            label: 'Sunset'
          }}
        />

        <JarbDateTimeInput
          id="dueDate"
          name="dueDate"
          label="Due date"
          placeholder="Please enter the due date for when the ticket needs to be resolved"
          dateFormat="DD-MM-YYYY"
          timeFormat="HH:mm:ss"
          jarb={{
            validator: 'Issue.dueDate',
            label: 'Due date'
          }}
        />
      </FinalForm>
    );
  });
