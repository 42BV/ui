import React from 'react';
import { AsyncState } from 'react-async';
import { UseQueryResult } from '@tanstack/react-query';

import { ContentState } from '../ContentState/ContentState';
import { t } from '../../utilities/translation/translation';
import { Button } from '../buttons/Button/Button';

type Text = {
  /**
   * Error text to show when an error occurred.
   */
  error?: string;

  /**
   * Loading text to show when a request is being fetched.
   */
  loading?: string;

  /**
   * Empty text to show when a request has loaded but the response
   * is considered empty.
   */
  empty?: string;

  /**
   * Text to show within the `retry` button.
   */
  retry?: string;
};

export type ReactAsyncState<T> = {
  /**
   * Result from calling `useAsync` from `react-async`.
   */
  state: AsyncState<T>;
};

export type ReactQueryState<T> = {
  /**
   * Result from calling `useQuery` from `@tanstack/react-query`.
   */
  state: UseQueryResult<T>;
};

export type Props<T> = {
  /**
   * Render function which takes the `data` from the `useQuery`'s
   * or `useAsync`'s `state` when the promise is fulfilled, and
   * expects you to render content.
   */
  children: (data: T) => React.ReactNode;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;

  /**
   * Optionally whether to show a retry button when the error state
   * occurs.
   * Defaults to `true`.
   *
   * @default true
   */
  showRetryButton?: boolean;

  /**
   * An optional callback which gets called when the data has
   * loaded. When `isEmpty` returns `true` the `emptyContent` is
   * rendered.
   */
  isEmpty?: (data?: T) => boolean;

  /**
   * Optionally when `isEmpty` returns `true` what content to render.
   *
   * Defaults to rendering a `ContentState` in the `empty` mode.
   */
  emptyContent?: (data?: T) => React.ReactNode;
};

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
export function AsyncContent<T>(
  props: Props<T> & (ReactAsyncState<T> | ReactQueryState<T>)
) {
  const {
    state,
    text = {},
    showRetryButton = true,
    isEmpty,
    emptyContent
  } = props;

  if (state.isLoading) {
    return (
      <ContentState
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
        mode="error"
        title={t({
          key: 'AsyncContent.ERROR.TITLE',
          fallback: 'Oops something went wrong!',
          overrideText: text.error
        })}
      >
        {showRetryButton ? (
          <Button
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
  return state.hasOwnProperty('isFulfilled');
}
