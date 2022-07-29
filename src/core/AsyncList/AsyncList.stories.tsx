import React from 'react';
import { storiesOf } from '@storybook/react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Alert, Button, Card, ListGroup, ListGroupItem } from 'reactstrap';

import AsyncList from './AsyncList';

import { pageOfUsers } from '../../test/fixtures';
import { User } from '../../test/types';
import { ContentState } from '../..';
import { action } from '@storybook/addon-actions';

function loadData(): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(pageOfUsers().content);
    }, 1000);
  });
}

function emptyData(): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 1000);
  });
}

function rejectData(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('could not load');
    }, 1000);
  });
}

function loadingData(): Promise<User[]> {
  return new Promise(() => undefined);
}

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      cacheTime: 0
    }
  }
});

storiesOf('core/Async/AsyncList', module)
  .addParameters({ component: AsyncList })
  .addDecorator((Story) => (
    <QueryClientProvider client={client}>
      <Alert color="warning" className="mb-4">
        <p>To be able to use AsyncList, you have to add @tanstack/react-query to your dependencies:</p>
        <code>npm install --save @tanstack/react-query</code>
      </Alert>
      <Story />
    </QueryClientProvider>
  ))
  .add('when loaded', () => {
    const state = useQuery(['data'], loadData);

    return (
      <Card body>
        <AsyncList state={state}>
          {(users) => (
            <ListGroup>
              {users.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when error', () => {
    const state = useQuery(['data'], rejectData);

    return (
      <Card body>
        <AsyncList state={state}>
          {(users) => (
            <ListGroup>
              {users.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when error with custom text', () => {
    const state = useQuery(['data'], rejectData);

    return (
      <Card body>
        <AsyncList
          state={state}
          text={{ error: 'I’m sorry Dave, I’m afraid I can’t do that' }}
        >
          {(users) => (
            <ListGroup>
              {users.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when error with no retry button', () => {
    const state = useQuery(['data'], rejectData);

    return (
      <Card body>
        <AsyncList state={state} showRetryButton={false}>
          {(users) => (
            <ListGroup>
              {users.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when loading', () => {
    const state = useQuery(['data'], loadingData);

    return (
      <Card body>
        <AsyncList state={state}>
          {(users) => (
            <ListGroup>
              {users.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when loading with custom title', () => {
    const state = useQuery(['data'], loadingData);

    return (
      <Card body>
        <AsyncList state={state} text={{ loading: 'Loading Jeffrey' }}>
          {(users) => (
            <ListGroup>
              {users.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when empty', () => {
    const state = useQuery(['data'], emptyData);

    return (
      <Card body>
        <AsyncList state={state}>
          {(users) => (
            <ListGroup>
              {users.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when empty with custom title', () => {
    const state = useQuery(['data'], emptyData);

    return (
      <Card body>
        <AsyncList
          state={state}
          text={{ empty: "No Jeffrey's match your parameters try again" }}
        >
          {(users) => (
            <ListGroup>
              {users.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  })

  .add('when empty with custom empty', () => {
    const state = useQuery(['data'], emptyData);

    return (
      <Card body>
        <AsyncList
          state={state}
          emptyContent={() => (
            <ContentState mode="empty" title="No results found">
              <Button icon="refresh" onClick={action('clear filters')}>
                Clear filters
              </Button>
            </ContentState>
          )}
        >
          {(users) => (
            <ListGroup>
              {users.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncList>
      </Card>
    );
  });
