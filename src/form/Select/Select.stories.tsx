import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Select, { JarbSelect } from './Select';
import { FinalForm, Form, resolveAfter } from '../story-utils';
import { pageOfUsers, userUser, randomUser } from '../../test/fixtures';
import { User } from '../../test/types';
import { Icon, pageOf, Tooltip } from '../..';

type SubjectOption = {
  value: string;
  label: string;
};

storiesOf('Form/Select', module)
  .add('defined options', () => {
    return (
      <Form>
        <Select
          id="subject"
          label="Subject"
          placeholder="Please enter your subject"
          optionForValue={(option: SubjectOption) => option.label}
          isOptionEnabled={(option) => option.value !== 'awesome'}
          options={[
            { value: 'awesome', label: 'Awesome shit' },
            { value: 'super', label: 'Super shit' },
            { value: 'great', label: 'Great shit' },
            { value: 'good', label: 'good shit' }
          ]}
          onChange={(value) => action(`You entered ${value}`)}
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
          options={() => resolveAfter(pageOfUsers())}
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
          value={userUser()}
          optionForValue={(user: User) => user.email}
          options={() => Promise.resolve(pageOfUsers())}
          isOptionEqual={(a: User, b: User) => a.id === b.id}
          onChange={(value) => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('without placeholder', () => {
    return (
      <Form>
        <Select
          id="subject"
          label="Subject"
          optionForValue={(option: SubjectOption) => option.label}
          isOptionEnabled={(option) => option.value !== 'awesome'}
          options={[
            { value: 'awesome', label: 'Awesome shit' },
            { value: 'super', label: 'Super shit' },
            { value: 'great', label: 'Great shit' },
            { value: 'good', label: 'good shit' }
          ]}
          onChange={(value) => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('without label', () => {
    return (
      <Form>
        <Select
          id="subject"
          placeholder="Please enter your subject"
          optionForValue={(option: SubjectOption) => option.label}
          isOptionEnabled={(option) => option.value !== 'awesome'}
          options={[
            { value: 'awesome', label: 'Awesome shit' },
            { value: 'super', label: 'Super shit' },
            { value: 'great', label: 'Great shit' },
            { value: 'good', label: 'good shit' }
          ]}
          onChange={(value) => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('with custom label', () => {
    return (
      <Form>
        <Select
          id="subject"
          label={
            <div className="d-flex justify-content-between">
              <span>Subject</span>
              <Tooltip className="ml-1" content="The subject of your essay">
                <Icon icon="info" />
              </Tooltip>
            </div>
          }
          placeholder="Please enter your subject"
          optionForValue={(option: SubjectOption) => option.label}
          isOptionEnabled={(option) => option.value !== 'awesome'}
          options={[
            { value: 'awesome', label: 'Awesome shit' },
            { value: 'super', label: 'Super shit' },
            { value: 'great', label: 'Great shit' },
            { value: 'good', label: 'good shit' }
          ]}
          onChange={(value) => action(`You entered ${value}`)}
        />
      </Form>
    );
  })
  .add('value based options', () => {
    const [brand, setBrand] = useState<string>();
    const [model, setModel] = useState<string>();

    const allOptions = {
      Audi: ['A1', 'A2', 'A3', 'M5'],
      BMW: ['series 1', 'series 2', 'series 3', 'series 4', 'series 5'],
      Mercedes: ['Viano', 'Vito', 'Sprinter']
    };

    return (
      <Form>
        <Select
          id="brand"
          label="Brand"
          placeholder="Please select your brand"
          optionForValue={(option) => option}
          options={Object.keys(allOptions)}
          onChange={(value) => {
            setBrand(value);
            setModel(undefined);
          }}
          value={brand}
        />
        <Select
          id="model"
          label="Model"
          placeholder={
            brand ? 'Please select your model' : 'Please select a brand first'
          }
          optionForValue={(option: string) => option}
          options={brand ? allOptions[brand] : []}
          onChange={(value) => setModel(value)}
          value={model}
        />
      </Form>
    );
  })
  .add('value based async options', () => {
    const [brand, setBrand] = useState<string>();
    const [model, setModel] = useState<string>();

    const allOptions = {
      Audi: ['A1', 'A2', 'A3', 'M5'],
      BMW: ['series 1', 'series 2', 'series 3', 'series 4', 'series 5'],
      Mercedes: ['Viano', 'Vito', 'Sprinter']
    };

    return (
      <Form>
        <Select
          id="brand"
          label="Brand"
          placeholder="Please select your brand"
          optionForValue={(option) => option}
          options={() => resolveAfter(pageOf(Object.keys(allOptions), 1))}
          onChange={(value) => {
            setBrand(value);
            setModel(undefined);
          }}
          value={brand}
        />
        <Select
          id="model"
          label="Model"
          placeholder={
            brand ? 'Please select your model' : 'Please select a brand first'
          }
          optionForValue={(option: string) => option}
          options={() =>
            resolveAfter(pageOf(brand ? allOptions[brand] : [], 1))
          }
          onChange={(value: string) => setModel(value)}
          value={model}
          watch={brand}
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
