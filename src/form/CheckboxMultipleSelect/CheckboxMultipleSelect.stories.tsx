import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { range } from 'lodash';

import CheckboxMultipleSelect, {
  JarbCheckboxMultipleSelect
} from './CheckboxMultipleSelect';
import { FinalForm, Form } from '../story-utils';
import { pageOfUsers, userUser } from '../../test/fixtures';
import { User } from '../../test/types';
import { Icon, Tooltip } from '../..';

interface SubjectOption {
  value: string;
  label: string;
}

const options: SubjectOption[] = range(0, 100).map((i) => ({
  value: `${i}`,
  label: `Selection #${i}`
}));

storiesOf('Form/CheckboxMultipleSelect', module)
  .add('defined options', () => {
    const [value, setValue] = useState<SubjectOption[] | undefined>([]);

    return (
      <div>
        <Form>
          <CheckboxMultipleSelect
            id="subject"
            label="Subject"
            placeholder="Please select your subjects"
            optionForValue={(option: SubjectOption) => option.label}
            isOptionEnabled={(option) => option.value !== 'awesome'}
            options={options}
            value={value}
            onChange={setValue}
          />
        </Form>
      </div>
    );
  })
  .add('horizontal', () => {
    const [value, setValue] = useState<SubjectOption[] | undefined>([]);

    return (
      <div>
        <Form>
          <CheckboxMultipleSelect
            id="subject"
            label="Subject"
            placeholder="Please select your subjects"
            optionForValue={(option: SubjectOption) => option.label}
            isOptionEnabled={(option) => option.value !== 'awesome'}
            options={options.filter((_, index) => index < 5)}
            value={value}
            onChange={setValue}
            horizontal={true}
          />

          <p>
            <strong>Disclaimer:</strong> horizontal mode works best when there
            are not too many items
          </p>
        </Form>
      </div>
    );
  })
  .add('fetched options', () => {
    const [value, setValue] = useState<User[] | undefined>([]);

    return (
      <Form>
        <CheckboxMultipleSelect
          id="subject"
          label="Subject"
          placeholder="Please select your subjects"
          optionForValue={(user: User) => user.email}
          options={() => Promise.resolve(pageOfUsers())}
          value={value}
          onChange={setValue}
        />
      </Form>
    );
  })
  .add('custom isOptionEqual', () => {
    const [value, setValue] = useState<User[] | undefined>([userUser()]);

    return (
      <Form>
        <CheckboxMultipleSelect
          id="subject"
          label="Subject"
          placeholder="Please select your subjects"
          optionForValue={(user: User) => user.email}
          options={() => Promise.resolve(pageOfUsers())}
          isOptionEqual={(a: User, b: User) => a.id === b.id}
          value={value}
          onChange={setValue}
        />
      </Form>
    );
  })
  .add('without placeholder', () => {
    const [value, setValue] = useState<SubjectOption[] | undefined>([]);

    return (
      <div>
        <Form>
          <CheckboxMultipleSelect
            id="subject"
            label="Subject"
            optionForValue={(option: SubjectOption) => option.label}
            isOptionEnabled={(option) => option.value !== 'awesome'}
            options={options}
            value={value}
            onChange={setValue}
          />
        </Form>
      </div>
    );
  })
  .add('without label', () => {
    const [value, setValue] = useState<SubjectOption[] | undefined>([]);

    return (
      <div>
        <Form>
          <CheckboxMultipleSelect
            id="subject"
            placeholder="Please select your subjects"
            optionForValue={(option: SubjectOption) => option.label}
            isOptionEnabled={(option) => option.value !== 'awesome'}
            options={options}
            value={value}
            onChange={setValue}
          />
        </Form>
      </div>
    );
  })
  .add('with custom label', () => {
    const [value, setValue] = useState<SubjectOption[] | undefined>([]);

    return (
      <div>
        <Form>
          <CheckboxMultipleSelect
            id="subject"
            label={
              <div className="d-flex justify-content-between">
                <span>Subject</span>
                <Tooltip
                  className="ml-1"
                  content="Please select your most important subject"
                >
                  <Icon icon="info" />
                </Tooltip>
              </div>
            }
            placeholder="Please select your subjects"
            optionForValue={(option: SubjectOption) => option.label}
            isOptionEnabled={(option) => option.value !== 'awesome'}
            options={options}
            value={value}
            onChange={setValue}
          />
        </Form>
      </div>
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
          isOptionEnabled={(option) => option.value !== 'awesome'}
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
