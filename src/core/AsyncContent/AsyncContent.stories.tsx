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
  return Promise.reject('could not load');
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

  .add('when loading', () => {
    const state = useAsync(loadingData);

    return (
      <div className="text-center">
        <AsyncContent state={state}>
          {(data: { user: string }) => <h2>Hi, {data.user}</h2>}
        </AsyncContent>
      </div>
    );
  });
