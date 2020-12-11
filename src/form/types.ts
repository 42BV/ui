import { ValidationError } from '@42.nl/jarb-final-form';

import { Translation } from '../utilities/translation/translator';
import { ReactNode } from 'react';
import { Color } from '..';

export type MetaError = ValidationError | ReactNode | Translation;

/**
 * Defines the type of the Meta property as given by final-form.
 * We re-type the `error` so it correct understands MetaError.
 */
export type Meta = {
  active?: boolean;
  touched?: boolean;
  error?: MetaError | MetaError[];
};

export type UnionKeys<T> = T extends any ? keyof T : never;
export type DistributiveOmit<T, K extends UnionKeys<T>> = T extends any
  ? Omit<T, Extract<keyof T, K>>
  : never;

export type FieldCompatible<Value, ChangeValue> = {
  /**
   * Optionally the id of the form element. Will be automatically
   * filled in when not provided manually.
   */
  id?: string;

  /**
   * Optionally the label of the form element.
   */
  label?: React.ReactNode;

  /**
   * The value that the form element currently has.
   */
  value?: Value;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value: ChangeValue) => void;

  /**
   * Optional callback for when the form element is focused.
   */
  onFocus?: () => void;

  /**
   * Optional callback for when the form element is blurred.
   */
  onBlur?: () => void;

  /**
   * Whether or not the form element is currently valid.
   */
  valid?: boolean;

  /**
   * Optionally the error message to render.
   */
  error?: ReactNode;

  /**
   * Optionally the placeholder of the form element.
   */
  placeholder?: string;

  /**
   * Optionally the color of the FormGroup.
   */
  color?: Color;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};
