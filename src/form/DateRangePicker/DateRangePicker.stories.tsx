import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { FinalForm, Form } from '../story-utils';
import DateRangePicker, { JarbDateRangePicker } from './DateRangePicker';

storiesOf('Form|DateTime/DateRangePicker', module)
  .add('basic', () => {
    return (
      <Form>
        <DateRangePicker
          onChange={() => action('value changed')}
          from={{
            id: 'fromId',
            label: 'From Date',
            placeholder: 'Please enter a From date',
            dateFormat: 'YYYY-MM-DD',
            timeFormat: 'HH:mm:ss',
            isDateAllowed: current => current.day() !== 0 && current.day() !== 6
          }}
          to={{
            id: 'toId',
            label: 'To Date',
            placeholder: 'Please enter a To date',
            dateFormat: 'YYYY-MM-DD',
            timeFormat: 'HH:mm:ss',
            isDateAllowed: current => current.day() !== 0 && current.day() !== 6
          }}
        />
      </Form>
    );
  })
  .add('open in modal', () => {
    return (
      <Form>
        <DateRangePicker
          onChange={() => action('value changed')}
          from={{
            id: 'fromId',
            label: 'From Date',
            placeholder: 'Please enter a From date',
            dateFormat: 'YYYY-MM-DD',
            timeFormat: 'HH:mm:ss',
            isDateAllowed: current => current.day() !== 0 && current.day() !== 6
          }}
          to={{
            id: 'toId',
            label: 'To Date',
            placeholder: 'Please enter a To date',
            dateFormat: 'YYYY-MM-DD',
            timeFormat: 'HH:mm:ss',
            isDateAllowed: current => current.day() !== 0 && current.day() !== 6
          }}
          mode={'modal'}
        />
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbDateRangePicker
          name="availability"
          jarb={{
            validator: 'User.availability',
            label: 'Availability'
          }}
          from={{
            id: 'fromId',
            label: 'From Date',
            placeholder: 'Please enter a From date',
            dateFormat: 'YYYY-MM-DD',
            timeFormat: 'HH:mm:ss',
            isDateAllowed: current => current.day() !== 0 && current.day() !== 6
          }}
          to={{
            id: 'toId',
            label: 'To Date',
            placeholder: 'Please enter a To date',
            dateFormat: 'YYYY-MM-DD',
            timeFormat: 'HH:mm:ss',
            isDateAllowed: current => current.day() !== 0 && current.day() !== 6
          }}
        />
      </FinalForm>
    );
  });
