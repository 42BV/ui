import { ValidationError } from '@42.nl/jarb-final-form';

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
