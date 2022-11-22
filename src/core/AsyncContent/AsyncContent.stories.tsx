import React from 'react';
import { storiesOf } from '@storybook/react';

import { AsyncContent } from './AsyncContent';
import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from '@tanstack/react-query';
import { action } from '@storybook/addon-actions';
import { Alert } from 'reactstrap';
import { ContentState } from '../ContentState/ContentState';
import { Button } from '../Button/Button';

function loadData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ user: 'Jeffrey' });
    }, 1000);
  });
}

function rejectData() {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject('could not load');
    }, 1000);
  });
}

function loadingData() {
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

storiesOf('core/async/AsyncContent', module)
  .addParameters({ component: AsyncContent })
  .addDecorator((Story) => (
    <QueryClientProvider client={client}>
      <Alert color="warning" className="mb-4">
        <p>
          To be able to use AsyncContent, you have to add @tanstack/react-query
          to your dependencies:
        </p>
        <code>npm install --save @tanstack/react-query</code>
      </Alert>
      <Story />
    </QueryClientProvider>
  ))
  .add('loaded', () => {
    const state = useQuery(['loaded'], loadData);

    return (
      <div className="text-center">
        <AsyncContent state={state}>
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  })

  .add('error', () => {
    const state = useQuery(['error'], rejectData);

    return (
      <div className="text-center">
        <AsyncContent state={state}>
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  })

  .add('error with custom text', () => {
    const state = useQuery(['error', 'custom text'], rejectData);

    return (
      <div className="text-center">
        <AsyncContent
          state={state}
          text={{ error: 'I’m sorry Dave, I’m afraid I can’t do that' }}
        >
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  })

  .add('error with no retry button', () => {
    const state = useQuery(['error', 'no retry'], rejectData);

    return (
      <div className="text-center">
        <AsyncContent state={state} showRetryButton={false}>
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  })

  .add('loading', () => {
    const state = useQuery(['loading'], loadingData);

    return (
      <div className="text-center">
        <AsyncContent state={state}>
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  })

  .add('loading with custom title', () => {
    const state = useQuery(['loading', 'custom title'], loadingData);

    return (
      <div className="text-center">
        <AsyncContent state={state} text={{ loading: 'Loading Jeffrey' }}>
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  })

  .add('empty', () => {
    const state = useQuery(['empty'], loadData);

    return (
      <div className="text-center">
        <AsyncContent
          state={state}
          isEmpty={(data: { user: string }) => data.user === 'Jeffrey'}
        >
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  })

  .add('empty with custom title', () => {
    const state = useQuery(['empty', 'custom title'], loadData);

    return (
      <div className="text-center">
        <AsyncContent
          state={state}
          text={{ empty: "No Jeffrey's match your parameters try again" }}
          isEmpty={(data: { user: string }) => data.user === 'Jeffrey'}
        >
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  })

  .add('empty with custom empty', () => {
    const state = useQuery(['empty', 'custom empty'], loadData);

    return (
      <div className="text-center">
        <AsyncContent
          state={state}
          isEmpty={(data: { user: string }) => data.user === 'Jeffrey'}
          emptyContent={() => (
            <ContentState mode="empty" title="No results found">
              <Button icon="refresh" onClick={action('clear filters')}>
                Clear filters
              </Button>
            </ContentState>
          )}
        >
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  });
