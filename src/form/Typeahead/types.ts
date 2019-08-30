import { Page } from '@42.nl/spring-connect';

/**
 * Callback which takes a query string and is expected to return
 * a Promise which resolves to a Page of T.
 */
export type FetchOptionsCallback<T> = (query: string) => Promise<Page<T>>;

/**
 * Represents the value of a Typeahead.
 */
export interface TypeaheadOption<T> {
  label: string;
  value: T;
}
