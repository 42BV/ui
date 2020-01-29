import React from 'react';

import AsyncContent, {
  Props as AsyncContentProps
} from '../AsyncContent/AsyncContent';

type Props<T> = Omit<AsyncContentProps<T>, 'isEmpty'>;

export function isEmpty<T>(list: T[]) {
  return list.length === 0;
}

/**
 * The `AsyncList` is a variant of the `AsyncContent` which expects
 * the result of a call to `useAsync` from `react-async` to be an
 * array.
 *
 * It has all the behaviors of the `AsyncContent` but provides a
 * standard `isEmpty` function which checks if the array has the
 * `length` zero.
 */
export default function AsyncList<T>(props: Props<T[]>) {
  return <AsyncContent {...props} isEmpty={isEmpty} />;
}
