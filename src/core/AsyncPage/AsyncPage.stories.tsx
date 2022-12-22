import React from 'react';
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

export default {
  title: 'core/async/AsyncPage',

  decorators: [
    (Story) => (
      <QueryClientProvider client={client}>
        <Alert color="warning" className="mb-4">
          <p>
            To be able to use AsyncPage, you have to add @tanstack/react-query
            and @42.nl/spring-connect to your dependencies:
          </p>
          <code>
            npm install --save @tanstack/react-query @42.nl/spring-connect
          </code>
        </Alert>
        <Story />
      </QueryClientProvider>
    )
  ],

  parameters: {
    component: AsyncPage
  }
};

const LoadedStory = () => {
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
};

export const Loaded = {
  render: LoadedStory,
  name: 'loaded'
};

const ErrorStory = () => {
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
};

export const Error = {
  render: ErrorStory,
  name: 'error'
};

const ErrorWithCustomTextStory = () => {
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
};

export const ErrorWithCustomText = {
  render: ErrorWithCustomTextStory,
  name: 'error with custom text'
};

const ErrorWithNoRetryButtonStory = () => {
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
};

export const ErrorWithNoRetryButton = {
  render: ErrorWithNoRetryButtonStory,
  name: 'error with no retry button'
};

const LoadingStory = () => {
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
};

export const Loading = {
  render: LoadingStory,
  name: 'loading'
};

const LoadingWithCustomTitleStory = () => {
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
};

export const LoadingWithCustomTitle = {
  render: LoadingWithCustomTitleStory,
  name: 'loading with custom title'
};

const EmptyStory = () => {
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
};

export const Empty = {
  render: EmptyStory,
  name: 'empty'
};

const EmptyWithCustomTitleStory = () => {
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
};

export const EmptyWithCustomTitle = {
  render: EmptyWithCustomTitleStory,
  name: 'empty with custom title'
};

const EmptyWithCustomContentStory = () => {
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
};

export const EmptyWithCustomContent = {
  render: EmptyWithCustomContentStory,
  name: 'empty with custom content'
};
