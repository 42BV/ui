import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import Checkbox, { JarbRadioGroup } from './RadioGroup';
import { FinalForm, Form, resolveAfter } from '../story-utils';
import { pageOfUsers, randomUser } from '../../test/fixtures';
import { User } from '../../test/types';
import { Icon, Tooltip } from '../..';

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
  .add('horizontal', () => {
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
          horizontal={true}
        />

        {subject ? <p>Your chosen subject is: {subject.label}</p> : null}

        <p>
          <strong>Disclaimer:</strong> horizontal mode works best when there are
          not too many items
        </p>
      </Form>
    );
  })
  .add('horizontal with clear', () => {
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
          horizontal={true}
          canClear={true}
        />

        {subject ? <p>Your chosen subject is: {subject.label}</p> : null}

        <p>
          <strong>Disclaimer:</strong> horizontal mode works best when there are
          not too many items
        </p>
      </Form>
    );
  })
  .add('with clear button', () => {
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
          canClear={true}
        />

        {subject ? <p>Your chosen subject is: {subject.label}</p> : null}
      </Form>
    );
  })
  .add('fetched options', () => {
    const [subject, setSubject] = useState<User | undefined>(randomUser());

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
  .add('without placeholder', () => {
    const [subject, setSubject] = useState<SubjectOption | undefined>(
      undefined
    );

    return (
      <Form>
        <Checkbox<SubjectOption>
          id="subject"
          label="Subject"
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
  .add('without label', () => {
    const [subject, setSubject] = useState<SubjectOption | undefined>(
      undefined
    );

    return (
      <Form>
        <Checkbox<SubjectOption>
          id="subject"
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
  .add('with custom label', () => {
    const [subject, setSubject] = useState<SubjectOption | undefined>(
      undefined
    );

    return (
      <Form>
        <Checkbox<SubjectOption>
          id="subject"
          label={
            <>
              <span>Subject</span>
              <Tooltip
                className="ml-1 position-relative"
                style={{ top: 4 }}
                content="Subjects are the best"
              >
                <Icon icon="info" />
              </Tooltip>
            </>
          }
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
    const [subject, setSubject] = useState<SubjectOption | undefined>({
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
