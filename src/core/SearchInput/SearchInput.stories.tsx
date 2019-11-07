import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import SearchInput from './SearchInput';
import { Card } from 'reactstrap';

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
  });
