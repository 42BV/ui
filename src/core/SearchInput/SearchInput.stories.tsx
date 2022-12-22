import React, { useState } from 'react';

import { SearchInput } from './SearchInput';

import { Alert, Card } from 'reactstrap';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip/Tooltip';
import { Button } from '../Button/Button';
import { Select } from '../../form/Select/Select';

export default {
  title: 'core/SearchInput',

  decorators: [
    (Story) => (
      <>
        <Alert color="warning" className="mb-4">
          <p>
            To be able to use SearchInput, you have to add lodash to your
            dependencies:
          </p>
          <code>npm install --save lodash</code>
        </Alert>
        <Story />
      </>
    )
  ],

  parameters: {
    component: SearchInput
  }
};

const DefaultStory = () => {
  const [query, setQuery] = useState('');

  return (
    <Card body>
      <p>You searched for: {query}</p>
      <SearchInput label="Search" defaultValue={query} onChange={setQuery} />
    </Card>
  );
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};

const WithoutIconStory = () => {
  const [query, setQuery] = useState('');

  return (
    <Card body>
      <p>You searched for: {query}</p>
      <SearchInput
        label="Search"
        defaultValue={query}
        onChange={setQuery}
        showIcon={false}
      />
    </Card>
  );
};

export const WithoutIcon = {
  render: WithoutIconStory,
  name: 'without icon'
};

const WithCustomDebounceStory = () => {
  const [query, setQuery] = useState('');

  return (
    <Card body>
      <p>You searched for: {query}</p>
      <SearchInput
        defaultValue={query}
        onChange={setQuery}
        debounce={1000}
        label="Search"
      />
    </Card>
  );
};

export const WithCustomDebounce = {
  render: WithCustomDebounceStory,
  name: 'with custom debounce'
};

const WithCustomDebounceSettingsStory = () => {
  const [query, setQuery] = useState('');

  return (
    <Card body>
      <p>You searched for: {query}</p>
      <SearchInput
        label="Search"
        defaultValue={query}
        onChange={setQuery}
        debounce={1000}
        debounceSettings={{ leading: true, trailing: true }}
      />
    </Card>
  );
};

export const WithCustomDebounceSettings = {
  render: WithCustomDebounceSettingsStory,
  name: 'with custom debounce settings'
};

const WithPlaceholderStory = () => {
  const [query, setQuery] = useState('');

  return (
    <Card body>
      <p>You searched for: {query}</p>
      <SearchInput
        defaultValue={query}
        onChange={setQuery}
        placeholder="Search..."
        label="Search"
      />
    </Card>
  );
};

export const WithPlaceholder = {
  render: WithPlaceholderStory,
  name: 'with placeholder'
};

const InvisibleLabelStory = () => {
  const [query, setQuery] = useState('');

  return (
    <Card body>
      <p>You searched for: {query}</p>
      <SearchInput
        id="search"
        label="Search"
        hiddenLabel={true}
        defaultValue={query}
        onChange={setQuery}
      />
    </Card>
  );
};

export const InvisibleLabel = {
  render: InvisibleLabelStory,
  name: 'invisible label'
};

const WithCustomLabelStory = () => {
  const [query, setQuery] = useState('');

  return (
    <Card body>
      <p>You searched for: {query}</p>
      <SearchInput
        id="search"
        label={
          <div className="d-flex justify-content-between">
            <span>Search</span>
            <Tooltip className="ms-1" content="Search the following fields">
              <Icon icon="info" />
            </Tooltip>
          </div>
        }
        defaultValue={query}
        onChange={setQuery}
      />
    </Card>
  );
};

export const WithCustomLabel = {
  render: WithCustomLabelStory,
  name: 'with custom label'
};

const WithExternalValueStory = () => {
  const [query, setQuery] = useState('');

  return (
    <Card body>
      <p>You searched for: {query}</p>

      <SearchInput
        defaultValue={query}
        onChange={setQuery}
        debounce={1000}
        label="Search"
      >
        {(searchInput, { setValue }) => (
          <>
            {searchInput}

            <Button className="mt-3" onClick={() => setValue('')}>
              Clear query
            </Button>

            <Select
              className="mt-2"
              id="predefined-query"
              label="Predefined queries"
              value={query}
              placeholder="Please select a predefined query"
              options={['Maarten', 'Jeffrey']}
              labelForOption={(option) => option}
              onChange={(value) => {
                if (value) {
                  setValue(value);
                }
              }}
            />
          </>
        )}
      </SearchInput>
    </Card>
  );
};

export const WithExternalValue = {
  render: WithExternalValueStory,
  name: 'with external value'
};

const WithoutClearButtonStory = () => {
  const [query, setQuery] = useState('');

  return (
    <Card body>
      <p>You searched for: {query}</p>
      <SearchInput
        label="Search"
        defaultValue={query}
        onChange={setQuery}
        canClear={false}
      />
    </Card>
  );
};

export const WithoutClearButton = {
  render: WithoutClearButtonStory,
  name: 'without clear button'
};
