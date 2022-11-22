import React from 'react';

import { AsyncContent } from '../AsyncContent/AsyncContent';
import { AsyncContentProps } from '../types';

export function isEmpty<T>(list: T[]): boolean {
  return list.length === 0;
}

/**
 * The `AsyncList` is a variant of the `AsyncContent` which expects
 * the result of a call to `useQuery` from `react-query` or `useAsync`
 * from `react-async` to be an array.
 *
 * It has all the behaviors of the `AsyncContent` but provides a
 * standard `isEmpty` function which checks if the array has the
 * `length` zero.
 */
export function AsyncList<T>({ children, ...props }: AsyncContentProps<T[]>) {
  return (
    <AsyncContent {...props} isEmpty={isEmpty}>
      {children}
    </AsyncContent>
  );
}
