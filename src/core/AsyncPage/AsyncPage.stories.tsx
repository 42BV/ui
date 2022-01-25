import React from 'react';
import { storiesOf } from '@storybook/react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { Button, Card, ListGroup, ListGroupItem } from 'reactstrap';
import { emptyPage, Page } from '@42.nl/spring-connect';

import AsyncPage from './AsyncPage';

import { pageOfUsers } from '../../test/fixtures';
import { User } from '../../test/types';
import { ContentState } from '../..';
import { action } from '@storybook/addon-actions';

function loadData(): Promise<Page<User>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(pageOfUsers());
    }, 1000);
  });
}

function emptyData(): Promise<Page<User>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(emptyPage<User>());
    }, 1000);
  });
}

function rejectData(): Promise<Page<User>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('could not load');
    }, 1000);
  });
}

function loadingData(): Promise<Page<User>> {
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

storiesOf('core/async/AsyncPage', module)
  .addParameters({ component: AsyncPage })
  .addDecorator((Story) => (
    <QueryClientProvider client={client}>
      <Story />
    </QueryClientProvider>
  ))
  .add('when loaded', () => {
    const state = useQuery('data', loadData);

    return (
      <Card body>
        <AsyncPage state={state}>
          {(userPage) => (
            <ListGroup>
              {userPage.content.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncPage>
      </Card>
    );
  })

  .add('when error', () => {
    const state = useQuery('data', rejectData);

    return (
      <Card body>
        <AsyncPage state={state}>
          {(userPage) => (
            <ListGroup>
              {userPage.content.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncPage>
      </Card>
    );
  })

  .add('when error with custom text', () => {
    const state = useQuery('data', rejectData);

    return (
      <Card body>
        <AsyncPage
          state={state}
          text={{ error: 'I’m sorry Dave, I’m afraid I can’t do that' }}
        >
          {(userPage) => (
            <ListGroup>
              {userPage.content.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncPage>
      </Card>
    );
  })

  .add('when error with no retry button', () => {
    const state = useQuery('data', rejectData);

    return (
      <Card body>
        <AsyncPage state={state} showRetryButton={false}>
          {(userPage) => (
            <ListGroup>
              {userPage.content.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncPage>
      </Card>
    );
  })

  .add('when loading', () => {
    const state = useQuery('data', loadingData);

    return (
      <Card body>
        <AsyncPage state={state}>
          {(userPage) => (
            <ListGroup>
              {userPage.content.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncPage>
      </Card>
    );
  })

  .add('when loading with custom title', () => {
    const state = useQuery('data', loadingData);

    return (
      <Card body>
        <AsyncPage state={state} text={{ loading: 'Loading Jeffrey' }}>
          {(userPage) => (
            <ListGroup>
              {userPage.content.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncPage>
      </Card>
    );
  })

  .add('when empty', () => {
    const state = useQuery('data', emptyData);

    return (
      <Card body>
        <AsyncPage state={state}>
          {(userPage) => (
            <ListGroup>
              {userPage.content.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncPage>
      </Card>
    );
  })

  .add('when empty with custom title', () => {
    const state = useQuery('data', emptyData);

    return (
      <Card body>
        <AsyncPage
          state={state}
          text={{ empty: "No Jeffrey's match your parameters try again" }}
        >
          {(userPage) => (
            <ListGroup>
              {userPage.content.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncPage>
      </Card>
    );
  })

  .add('when empty with custom content', () => {
    const state = useQuery('data', emptyData);

    return (
      <Card body>
        <AsyncPage
          state={state}
          emptyContent={() => (
            <ContentState mode="empty" title="No results found">
              <Button icon="refresh" onClick={action('clear filters')}>
                Clear filters
              </Button>
            </ContentState>
          )}
        >
          {(userPage) => (
            <ListGroup>
              {userPage.content.map((user) => (
                <ListGroupItem key={user.id}>{user.email}</ListGroupItem>
              ))}
            </ListGroup>
          )}
        </AsyncPage>
      </Card>
    );
  });
