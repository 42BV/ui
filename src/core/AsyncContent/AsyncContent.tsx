import React from 'react';
import { AsyncState } from 'react-async';

import ContentState from '../ContentState/ContentState';
import { t } from '../../utilities/translation/translation';

interface Text {
  title?: string;
}

type Props<T> = {
  children: (data: T) => React.ReactNode;
  state: AsyncState<T>;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;
};

export default function AsyncContent<T>(props: Props<T>) {
  const { state, text = {} } = props;

  if (state.isLoading) {
    return (
      <ContentState
        mode="loading"
        title={t({
          key: 'ContentState.LOADING.TITLE',
          fallback: 'Loading...',
          overrideText: text.title
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
            key: 'ContentState.ERROR.TITLE',
            fallback: 'Oops something went wrong!',
            overrideText: text.title
          })}
        />
      );
    }
  }
}
