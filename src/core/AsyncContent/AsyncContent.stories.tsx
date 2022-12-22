import React from 'react';

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

export default {
  title: 'core/async/AsyncContent',

  decorators: [
    (Story) => (
      <QueryClientProvider client={client}>
        <Alert color="warning" className="mb-4">
          <p>
            To be able to use AsyncContent, you have to add
            @tanstack/react-query to your dependencies:
          </p>
          <code>npm install --save @tanstack/react-query</code>
        </Alert>
        <Story />
      </QueryClientProvider>
    )
  ],

  parameters: {
    component: AsyncContent
  }
};

const LoadedStory = () => {
  const state = useQuery(['loaded'], loadData);

  return (
    <div className="text-center">
      <AsyncContent state={state}>
        {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
      </AsyncContent>
    </div>
  );
};

export const Loaded = {
  render: LoadedStory,
  name: 'loaded'
};

const ErrorStory = () => {
  const state = useQuery(['error'], rejectData);

  return (
    <div className="text-center">
      <AsyncContent state={state}>
        {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
      </AsyncContent>
    </div>
  );
};

export const Error = {
  render: ErrorStory,
  name: 'error'
};

const ErrorWithCustomTextStory = () => {
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
};

export const ErrorWithCustomText = {
  render: ErrorWithCustomTextStory,
  name: 'error with custom text'
};

const ErrorWithNoRetryButtonStory = () => {
  const state = useQuery(['error', 'no retry'], rejectData);

  return (
    <div className="text-center">
      <AsyncContent state={state} showRetryButton={false}>
        {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
      </AsyncContent>
    </div>
  );
};

export const ErrorWithNoRetryButton = {
  render: ErrorWithNoRetryButtonStory,
  name: 'error with no retry button'
};

const LoadingStory = () => {
  const state = useQuery(['loading'], loadingData);

  return (
    <div className="text-center">
      <AsyncContent state={state}>
        {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
      </AsyncContent>
    </div>
  );
};

export const Loading = {
  render: LoadingStory,
  name: 'loading'
};

const LoadingWithCustomTitleStory = () => {
  const state = useQuery(['loading', 'custom title'], loadingData);

  return (
    <div className="text-center">
      <AsyncContent state={state} text={{ loading: 'Loading Jeffrey' }}>
        {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
      </AsyncContent>
    </div>
  );
};

export const LoadingWithCustomTitle = {
  render: LoadingWithCustomTitleStory,
  name: 'loading with custom title'
};

const EmptyStory = () => {
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
};

export const Empty = {
  render: EmptyStory,
  name: 'empty'
};

const EmptyWithCustomTitleStory = () => {
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
};

export const EmptyWithCustomTitle = {
  render: EmptyWithCustomTitleStory,
  name: 'empty with custom title'
};

const EmptyWithCustomEmptyStory = () => {
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
};

export const EmptyWithCustomEmpty = {
  render: EmptyWithCustomEmptyStory,
  name: 'empty with custom empty'
};
