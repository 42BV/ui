import React, { ReactNode } from 'react';
import { ValidationError } from '@42.nl/jarb-final-form';

import { Translation } from '../utilities/translation/translator';
import { Color } from '..';
import {
  OptionEnabledCallback,
  OptionEqual,
  OptionForValue,
  OptionsFetcher,
  UniqueKeyForValue
} from './option';

export type MetaError = ValidationError | React.ReactNode | Translation;

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

export type FieldOptionsCompatible<Value> = {
  /**
   * Is either an array of options or a callback which fetches
   * the options asynchronously.
   */
  options: OptionsFetcher<Value> | Value[];

  /**
   * Callback to convert an value of type T to an option to show
   * to the user.
   */
  optionForValue: OptionForValue<Value>;

  /**
   * Optional callback which is used to determine if two options
   * of type T are equal.
   *
   * When `isOptionEqual` is not defined the outcome of `optionForValue`
   * is used to test equality.
   */
  isOptionEqual?: OptionEqual<Value>;

  /**
   * Optional callback which is called for every option to determine
   * if the option can be selected. By default all options can be
   * selected.
   */
  isOptionEnabled?: OptionEnabledCallback<Value>;

  /**
   * Optional callback to get a unique key for an item.
   * This is used to provide each option in the form element a unique key.
   * Defaults to the 'id' property if it exists, otherwise uses optionForValue.
   */
  uniqueKeyForValue?: UniqueKeyForValue<Value>;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;

  /**
   * Optionally a value to detect changes and trigger
   * the optionsFetcher to reload the options.
   */
  watch?: any;
};

export type FieldWithOptionsCompatible<Value, ChangeValue> = FieldCompatible<
  Value,
  ChangeValue
> &
  FieldOptionsCompatible<Value>;

export type MultiFieldWithOptionsCompatible<
  Value,
  ChangeValue
> = FieldCompatible<Value[], ChangeValue> & FieldOptionsCompatible<Value>;

export type Text = {
  /**
   * The message to show when the form element is loading.
   * Defaults to `loading...`
   */
  loadingMessage?: string;
};
