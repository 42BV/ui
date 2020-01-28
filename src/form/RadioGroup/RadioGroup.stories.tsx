import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import Checkbox, { JarbRadioGroup } from './RadioGroup';
import { FinalForm, Form, resolveAfter } from '../story-utils';
import { pageOfUsers, randomUser } from '../../../test/fixtures';
import { User } from '../../../test/types';

interface SubjectOption {
  value: string;
  label: string;
}

storiesOf('Form|RadioGroup', module)
  .add('defined options', () => {
    const [subject, setSubject] = useState<SubjectOption | undefined>(
      undefined
    );

    return (
      <Form>
        <Checkbox<SubjectOption>
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
          value={subject}
          onChange={setSubject}
        />

        {subject ? <p>Your chosen subject is: {subject.label}</p> : null}
      </Form>
    );
  })
  .add('fetched options', () => {
    const [subject, setSubject] = useState<User>(randomUser());

    return (
      <Form>
        <Checkbox<User>
          id="subject"
          label="Subject"
          placeholder="Please enter your subject"
          optionForValue={(user: User) => user.email}
          options={() => resolveAfter(pageOfUsers)}
          value={subject}
          onChange={setSubject}
        />

        {subject ? <p>Your chosen subject is: {subject.email}</p> : null}
      </Form>
    );
  })
  .add('custom isOptionEqual', () => {
    const [subject, setSubject] = useState<User | undefined>(undefined);

    return (
      <Form>
        <Checkbox<User>
          id="subject"
          label="Subject"
          placeholder="Please enter your subject"
          optionForValue={(user: User) => user.email}
          options={() => Promise.resolve(pageOfUsers)}
          isOptionEqual={(a: User, b: User) => a.id === b.id}
          value={subject}
          onChange={setSubject}
        />

        {subject ? <p>Your chosen subject is: {subject.email}</p> : null}
      </Form>
    );
  })
  .add('jarb', () => {
    return (
      <FinalForm>
        <JarbRadioGroup
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
    const [subject, setSubject] = useState({
      value: 'great',
      label: 'Great shit'
    });

    return (
      <Form>
        <Checkbox<SubjectOption>
          id="subject"
          label="Subject"
          placeholder="Please enter your subject"
          optionForValue={(option: SubjectOption) => option.label}
          options={[
            { value: 'awesome', label: 'Awesome shit' },
            { value: 'super', label: 'Super shit' },
            { value: 'great', label: 'Great shit' },
            { value: 'good', label: 'good shit' }
          ]}
          value={subject}
          onChange={setSubject}
        />
        {subject ? <p>Your chosen subject is: {subject.label}</p> : null}
      </Form>
    );
  });
