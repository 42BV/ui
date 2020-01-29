import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Select, { JarbSelect } from './Select';
import { FinalForm, Form, resolveAfter } from '../story-utils';
import { pageOfUsers, userUser, randomUser } from '../../test/fixtures';
import { User } from '../../test/types';

interface SubjectOption {
  value: string;
  label: string;
}

storiesOf('Form|Select', module)
  .add('defined options', () => {
    return (
      <Form>
        <Select
          id="subject"
          label="Subject"
          placeholder="Please enter your subject"
          optionForValue={(option: SubjectOption) => option.label}
          isOptionEnabled={option => option.value !== 'awesome'}
          options={[
            { value: 'awesome', label: 'Awesome shit' },
            { value: 'super', label: 'Super shit' },
            { value: 'great', label: 'Great shit' },
            { value: 'good', label: 'good shit' }
          ]}
          onChange={value => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('fetched options', () => {
    const [subject, setSubject] = useState<User>(randomUser());

    return (
      <Form>
        <Select
          id="subject"
          label="Subject"
          placeholder="Please enter your subject"
          optionForValue={(user: User) => user.email}
          options={() => resolveAfter(pageOfUsers)}
          value={subject}
          onChange={setSubject}
        />
      </Form>
    );
  })
  .add('custom isOptionEqual', () => {
    return (
      <Form>
        <Select
          id="subject"
          label="Subject"
          placeholder="Please enter your subject"
          value={userUser}
          optionForValue={(user: User) => user.email}
          options={() => Promise.resolve(pageOfUsers)}
          isOptionEqual={(a: User, b: User) => a.id === b.id}
          onChange={value => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbSelect
          id="subject"
          name="subject"
          label="Subject"
          placeholder="Please enter your subject"
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
  })
  .add('default option', () => {
    const [value, setValue] = useState({ value: 'great', label: 'Great shit' });

    return (
      <Form>
        <Select<SubjectOption>
          id="subject"
          label="Subject"
          value={value}
          placeholder="Please enter your subject"
          optionForValue={(option: SubjectOption) => option.label}
          options={[
            { value: 'awesome', label: 'Awesome shit' },
            { value: 'super', label: 'Super shit' },
            { value: 'great', label: 'Great shit' },
            { value: 'good', label: 'good shit' }
          ]}
          onChange={setValue}
        />
      </Form>
    );
  });
