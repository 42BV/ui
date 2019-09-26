import React from 'react';
import { storiesOf } from '@storybook/react';

import AsyncContent from './AsyncContent';
import { useAsync } from 'react-async';

function loadData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ user: 'jeffrey' });
    }, 1000);
  });
}

function rejectData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('could not load');
    }, 1000);
  });
}

function loadingData() {
  return new Promise(() => undefined);
}

storiesOf('core|AsyncContent', module)
  .addParameters({ component: AsyncContent })
  .add('when loaded', () => {
    const state = useAsync(loadData);

    return (
      <div className="text-center">
        <AsyncContent state={state}>
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  })

  .add('when error', () => {
    const state = useAsync(rejectData);

    return (
      <div className="text-center">
        <AsyncContent state={state}>
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  })

  .add('when error with custom text', () => {
    const state = useAsync(rejectData);

    return (
      <div className="text-center">
        <AsyncContent state={state} text={{ error: "I’m sorry Dave, I’m afraid I can’t do that" }}>
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  })

  .add('when error with no retry button', () => {
    const state = useAsync(rejectData);

    return (
      <div className="text-center">
        <AsyncContent state={state} showRetryButton={false}>
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  })

  .add('when loading', () => {
    const state = useAsync(loadingData);

    return (
      <div className="text-center">
        <AsyncContent state={state}>
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  })

  .add('when loading with custom title', () => {
    const state = useAsync(loadingData);

    return (
      <div className="text-center">
        <AsyncContent state={state} text={{ loading: "Loading Jeffrey" }}>
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  });
