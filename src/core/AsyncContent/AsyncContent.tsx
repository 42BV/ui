import React from 'react';
import { AsyncState } from 'react-async';

import ContentState from '../ContentState/ContentState';
import { t } from '../../utilities/translation/translation';
import Button from '../Button/Button';

interface Text {
  /**
   * Error text to show when an error occurred.
   */
  error?: string;

  /**
   * Loading text to show when a request is being fetched.
   */
  loading?: string;

  /**
   * Text to show within the `retry` button.
   */
  retry?: string;
}

type Props<T> = {
  /**
   * Render function which takes the `data` from the `useAsync`'s
   * `state` when the promise is fulfilled, and expects a you
   * to render content.
   */
  children: (data: T) => React.ReactNode;

  /**
   * Result from calling `useAsync` from `react-async`.
   */
  state: AsyncState<T>;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;

  /**
   * Optionally whether or not to show a retry button when the
   * error state occurs. Defaults to `true`.
   *
   * @default true
   */
  showRetryButton?: boolean;
};

/**
 * AsyncContent is a component which can be used to render the
 * result of a call to `useAsync` from `react-async`.
 *
 * It has the following behaviors:
 *
 * 1. When the state is loading it shows a `ContentState` in the `loading` mode.
 *
 * 2. When an error occurs it shows a `ContentState` in the `error` mode.
 *    By default it will then show a `Retry` button allowing the user
 *    to try again.
 *
 * 3. When the state has loaded successfully it will render the `children`
 *    render function and it provides the `state.data` for you to render.
 *
 * With these behaviors you ensure that you always handle the error and
 * loading state when using `useAsync`.
 */
export default function AsyncContent<T>(props: Props<T>) {
  const { state, text = {}, showRetryButton = true } = props;

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
  } else {
    if (state.isFulfilled) {
      return <>{props.children(state.data)}</>;
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
            <Button icon="refresh" onClick={() => state.reload()}>
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
}
