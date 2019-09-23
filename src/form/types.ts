import { ValidationError } from '@42.nl/jarb-final-form';
import { Page } from '@42.nl/spring-connect';

import { Translation } from '../utilities/translation/translator';
export { Color } from '../core/types';

export type MetaError = ValidationError | string | Translation;

/**
 * Defines the type of the Meta property as given by final-form.
 * We re-type the `error` so it correct understands MetaError.
 */
export interface Meta {
  active?: boolean;
  touched?: boolean;
  error?: MetaError | MetaError[];
}

export type UnionKeys<T> = T extends any ? keyof T : never;
export type DistributiveOmit<T, K extends UnionKeys<T>> = T extends any
  ? Omit<T, Extract<keyof T, K>>
  : never;


/**
 * Callback to determine the label for a given value of type T.
 * Aka the text the user sees when selecting a value.
 */
export type OptionForValue<T> = (value: T) => string;

/**
 * Callback to determine if the option is currently enabled.
 */
export type OptionEnabledCallback<T> = (option: T) => boolean;

/**
 * Callback which should return a Page of options which can
 * be selected by the user.
 */
export type OptionsFetcher<T> = () => Promise<Page<T>>;

/**
 * Callback which should return a Page of options which can
 * be selected by the user. 
 * 
 * It is given three parameters:
 * 
 * 1. `query` A string you must use to filter the number of options.
 * Used for searches.
 * 
 * 2. `page` A number telling you which page you must load. Used
 * to limit the total number of elements by asking for a small slice
 * each time.
 * 
 * 3. `size` A number telling you the size of the Page you must load. 
 * Often components can only render so much options before becoming
 * unwieldy. They can tell you the size of options they an support
 * through this parameter.
 */
export type FetchOptionsCallback<T> = (
  query: string,
  page: number,
  size: number
) => Promise<Page<T>>;
