import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from '@tanstack/react-query';
import { Alert, Button, Card, ListGroup, ListGroupItem } from 'reactstrap';
import { emptyPage, Page } from '@42.nl/spring-connect';

import { AsyncPage } from './AsyncPage';

import { pageOfUsers } from '../../test/fixtures';
import { User } from '../../test/types';
import { ContentState } from '../ContentState/ContentState';
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
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject('could not load');
    }, 1000);
  });
}

function loadingData(): Promise<Page<User>> {
  return new Promise(() => {
    // this promise never resolves to be able to keep displaying loading state
  });
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
      <Alert color="warning" className="mb-4">
        <p>
          To be able to use AsyncPage, you have to add @tanstack/react-query and
          @42.nl/spring-connect to your dependencies:
        </p>
        <code>
          npm install --save @tanstack/react-query @42.nl/spring-connect
        </code>
      </Alert>
      <Story />
    </QueryClientProvider>
  ))
  .add('loaded', () => {
    const state = useQuery(['loaded'], loadData);

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

  .add('error', () => {
    const state = useQuery(['error'], rejectData);

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

  .add('error with custom text', () => {
    const state = useQuery(['error', 'custom text'], rejectData);

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

  .add('error with no retry button', () => {
    const state = useQuery(['error', 'no retry'], rejectData);

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

  .add('loading', () => {
    const state = useQuery(['loading'], loadingData);

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

  .add('loading with custom title', () => {
    const state = useQuery(['loading', 'custom title'], loadingData);

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

  .add('empty', () => {
    const state = useQuery(['empty'], emptyData);

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

  .add('empty with custom title', () => {
    const state = useQuery(['empty', 'custom title'], emptyData);

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

  .add('empty with custom content', () => {
    const state = useQuery(['empty', 'custom content'], emptyData);

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
