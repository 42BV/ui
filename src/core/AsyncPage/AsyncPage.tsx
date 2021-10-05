import React from 'react';

import AsyncContent, {
  Props as AsyncContentProps, ReactAsyncState, ReactQueryState
} from '../AsyncContent/AsyncContent';
import { Page } from '@42.nl/spring-connect';

type Props<T> = Omit<AsyncContentProps<T>, 'isEmpty'> & (ReactAsyncState<T> | ReactQueryState<T>);

export function isEmpty<T>(page: Page<T>): boolean {
  return page.totalElements === 0;
}

/**
 * The `AsyncPage` is a variant of `AsyncContent` which expects the
 * result of a call to `useQuery` from `react-query` or `useAsync`
 * from `react-async` to be a `Page` from `@42.nl/spring-connect`.
 *
 * It has all the behaviors of the `AsyncContent` but provides a
 * standard `isEmpty` function which checks if the `totalElements`
 * of the `Page` is zero.
 */
export default function AsyncPage<T>(props: Props<Page<T>>) {
  return <AsyncContent {...props} isEmpty={isEmpty} />;
}
