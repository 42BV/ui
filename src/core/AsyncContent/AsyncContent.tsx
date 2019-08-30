import React from 'react';
import { AsyncState } from 'react-async';

import ContentState from '../ContentState/ContentState';

type Props<T> = {
  children: (data: T) => React.ReactNode;
  state: AsyncState<T>;
};

export default function AsyncContent<T>(props: Props<T>) {
  const { state } = props;

  if (state.isLoading) {
    return <ContentState title="Loading..." mode="loading" />;
  } else {
    if (state.isFulfilled) {
      return <>{props.children(state.data)}</>;
    } else {
      console.error(state.error);
      return <ContentState mode="error" title="Oops something went wrong!" />;
    }
  }
}
