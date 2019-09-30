import React, { useState} from 'react';
import { storiesOf } from '@storybook/react';
import { range } from 'lodash';

import CheckboxMultipleSelect, {
  JarbCheckboxMultipleSelect
} from './CheckboxMultipleSelect';
import { FinalForm, Form } from '../story-utils';
import { pageOfUsers } from '../../test/fixtures';
import { User } from '../../test/types';

interface SubjectOption {
  value: string;
  label: string;
}

const options: SubjectOption[] = range(0, 100).map(i => ({
  value: `${i}`,
  label: `Selection #${i}`
}));

storiesOf('Form|CheckboxMultipleSelect', module)
  .add('defined options', () => {
    const [value, setValue] = useState([]);

    return (
      <div>
        <Form>
          <CheckboxMultipleSelect
            id="subject"
            label="Subject"
            placeholder="Please select your subjects"
            optionForValue={(option: SubjectOption) => option.label}
            isOptionEnabled={option => option.value !== 'awesome'}
            options={options}
            value={value}
            onChange={setValue}
          />
        </Form>
      </div>
    );
  })
  .add('fetched options', () => {
    const [value, setValue] = useState([]);

    return (
      <Form>
        <CheckboxMultipleSelect
          id="subject"
          label="Subject"
          placeholder="Please select your subjects"
          optionForValue={(user: User) => user.email}
          options={() => Promise.resolve(pageOfUsers)}
          value={value}
          onChange={setValue}
        />
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbCheckboxMultipleSelect
          id="subject"
          name="subject"
          label="Subject"
          placeholder="Please select your subjects"
          optionForValue={(option: SubjectOption) => option.label}
          isOptionEnabled={option => option.value !== 'awesome'}
          options={[
            { value: 'awesome', label: 'Awesome shit' },
            { value: 'super', label: 'Super shit' },
            { value: 'great', label: 'Great shit' },
            { value: 'good', label: 'good shit' }
          ]}
          jarb={{
            validator: 'Hero.name',
            label: 'Subject'
          }}
        />
      </FinalForm>
    );
  });
