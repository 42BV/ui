import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import SearchInput from './SearchInput';

import { Card } from 'reactstrap';
import { Button, Icon, Select, Tooltip } from '../..';

storiesOf('core/SearchInput', module)
  .addParameters({ component: SearchInput })
  .add('default', () => {
    const [query, setQuery] = useState('');

    return (
      <Card body>
        <p>You searched for: {query}</p>
        <SearchInput defaultValue={query} onChange={setQuery} />
      </Card>
    );
  })
  .add('without icon', () => {
    const [query, setQuery] = useState('');

    return (
      <Card body>
        <p>You searched for: {query}</p>
        <SearchInput
          defaultValue={query}
          onChange={setQuery}
          showIcon={false}
        />
      </Card>
    );
  })
  .add('with custom debounce', () => {
    const [query, setQuery] = useState('');

    return (
      <Card body>
        <p>You searched for: {query}</p>
        <SearchInput defaultValue={query} onChange={setQuery} debounce={1000} />
      </Card>
    );
  })
  .add('with custom debounce settings', () => {
    const [query, setQuery] = useState('');

    return (
      <Card body>
        <p>You searched for: {query}</p>
        <SearchInput
          defaultValue={query}
          onChange={setQuery}
          debounce={1000}
          debounceSettings={{ leading: true, trailing: true }}
        />
      </Card>
    );
  })
  .add('with placeholder', () => {
    const [query, setQuery] = useState('');

    return (
      <Card body>
        <p>You searched for: {query}</p>
        <SearchInput
          defaultValue={query}
          onChange={setQuery}
          placeholder="Search..."
        />
      </Card>
    );
  })
  .add('with label', () => {
    const [query, setQuery] = useState('');

    return (
      <Card body>
        <p>You searched for: {query}</p>
        <SearchInput
          id="search"
          label="Search"
          defaultValue={query}
          onChange={setQuery}
        />
      </Card>
    );
  })
  .add('with custom label', () => {
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
  })
  .add('with external value', () => {
    const [query, setQuery] = useState('');

    return (
      <Card body>
        <p>You searched for: {query}</p>

        <SearchInput defaultValue={query} onChange={setQuery} debounce={1000}>
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
  })
  .add('without clear button', () => {
    const [query, setQuery] = useState('');

    return (
      <Card body>
        <p>You searched for: {query}</p>
        <SearchInput
          defaultValue={query}
          onChange={setQuery}
          canClear={false}
        />
      </Card>
    );
  });
