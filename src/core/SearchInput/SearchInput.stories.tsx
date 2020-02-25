import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import SearchInput from './SearchInput';

import { Card } from 'reactstrap';
import { Select, Button } from '../..';

storiesOf('core|SearchInput', module)
  .addParameters({ component: SearchInput })
  .add('default', () => {
    const [query, setQuery] = useState('');

    return (
      <Card body>
        <p>You searched for: {query}</p>
        <SearchInput value={query} onChange={setQuery} />
      </Card>
    );
  })
  .add('without icon', () => {
    const [query, setQuery] = useState('');

    return (
      <Card body>
        <p>You searched for: {query}</p>
        <SearchInput value={query} onChange={setQuery} showIcon={false} />
      </Card>
    );
  })
  .add('with custom debounce', () => {
    const [query, setQuery] = useState('');

    return (
      <Card body>
        <p>You searched for: {query}</p>
        <SearchInput value={query} onChange={setQuery} debounce={1000} />
      </Card>
    );
  })
  .add('with custom debounce settings', () => {
    const [query, setQuery] = useState('');

    return (
      <Card body>
        <p>You searched for: {query}</p>
        <SearchInput
          value={query}
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
          value={query}
          onChange={setQuery}
          placeholder="Search..."
        />
      </Card>
    );
  })
  .add('with external value', () => {
    const [query, setQuery] = useState('');

    return (
      <Card body>
        <p>You searched for: {query}</p>

        <SearchInput value={query} onChange={setQuery} debounce={1000}>
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
                optionForValue={option => option}
                options={['Maarten', 'Jeffrey']}
                onChange={value => {
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
  });
