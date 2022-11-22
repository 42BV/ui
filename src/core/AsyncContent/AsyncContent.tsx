import React from 'react';
import { AsyncState } from 'react-async';
import { UseQueryResult } from '@tanstack/react-query';

import { ContentState } from '../ContentState/ContentState';
import { t } from '../../utilities/translation/translation';
import { Button } from '../Button/Button';
import { AsyncContentProps } from '../types';

/**
 * AsyncContent is a component which can be used to render the result of a
 * call to `useQuery` from `@tanstack/react-query` or `useAsync` from
 * `react-async`.
 *
 * It has the following behaviors:
 *
 * 1. When the state is loading it shows a `ContentState` in the `loading` mode.
 *
 * 2. When an error occurs it shows a `ContentState` in the `error` mode.
 *    By default, it will then show a `Retry` button allowing the user
 *    to try again.
 *
 * 3. When the state has loaded successfully, it will render the `children`
 *    render function, and it provides the `state.data` for you to render.
 *
 * 4. When the state has loaded successfully, it will ask via the `isEmpty`
 *    callback if you consider the `state.data` empty. It will then
 *    render the `emptyContent` when defined or by default show
 *    a `ContentState` in the `empty` mode.
 *
 * With these behaviors you ensure that you always handle the error and
 * loading state when using `useQuery` or `useAsync`.
 */
export function AsyncContent<TData>(props: AsyncContentProps<TData>) {
  const {
    state,
    text = {},
    showRetryButton = true,
    isEmpty,
    emptyContent,
    contentStateProps,
    retryButtonProps
  } = props;

  if (state.isLoading) {
    return (
      <ContentState
        {...contentStateProps}
        mode="loading"
        title={t({
          key: 'AsyncContent.LOADING.TITLE',
          fallback: 'Loading...',
          overrideText: text.loading
        })}
      />
    );
  } else if (isStateFulfilled(state)) {
    if (state.data && (!isEmpty || !isEmpty(state.data))) {
      return <>{props.children(state.data)}</>;
    } else if (emptyContent) {
      return <>{emptyContent(state.data)}</>;
    } else {
      return (
        <ContentState
          {...contentStateProps}
          mode="empty"
          title={t({
            key: 'AsyncContent.EMPTY.TITLE',
            fallback: 'No results found',
            overrideText: text.empty
          })}
        />
      );
    }
  } else {
    console.error(state.error);
    return (
      <ContentState
        {...contentStateProps}
        mode="error"
        title={t({
          key: 'AsyncContent.ERROR.TITLE',
          fallback: 'Oops something went wrong!',
          overrideText: text.error
        })}
      >
        {showRetryButton ? (
          <Button
            {...retryButtonProps}
            icon="refresh"
            onClick={() =>
              stateIsAsyncState(state) ? state.reload() : state.refetch()
            }
          >
            {t({
              key: 'AsyncContent.ERROR.RETRY',
              fallback: 'Retry',
              overrideText: text.retry
            })}
          </Button>
        ) : null}
      </ContentState>
    );
  }
}

function isStateFulfilled<T>(state: AsyncState<T> | UseQueryResult<T>) {
  return stateIsAsyncState(state) ? state.isFulfilled : !state.isError;
}

function stateIsAsyncState<T>(
  state: AsyncState<T> | UseQueryResult<T>
): state is AsyncState<T> {
  return 'isFulfilled' in state;
}
