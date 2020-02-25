import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import { constant, get } from 'lodash';

import withJarb from '../withJarb/withJarb';
import { Color } from '../types';
import { t } from '../../utilities/translation/translation';
import {
  isOptionSelected,
  OptionEnabledCallback,
  OptionEqual,
  OptionForValue,
  OptionsFetcher
} from '../option';
import { doBlur } from '../utils';
import Loading from '../../core/Loading/Loading';
import { useOptions } from '../useOptions';

export interface Text {
  /**
   * The message to show when the select is loading. Defaults
   * to `loading...`
   */
  loadingMessage?: string;
}

interface BaseProps<T> {
  /**
   * The id of the form element.
   */
  id?: string;

  /**
   * The value that the form element currently has.
   */
  value?: T;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value: T) => void;

  /**
   * Optional callback for when the form element is blurred.
   */
  onBlur?: () => void;

  /**
   * Is either an array of options or a callback which fetches
   * the options asynchronously.
   */
  options: OptionsFetcher<T> | T[];

  /**
   * Callback to convert an value of type T to an option to show
   * to the user.
   */
  optionForValue: OptionForValue<T>;

  /**
   * Optional callback which is used to determine if two options
   * of type T are equal.
   *
   * When `isOptionEqual` is not defined the outcome of `optionForValue`
   * is used to test equality.
   */
  isOptionEqual?: OptionEqual<T>;

  /**
   * Optional callback which is called for every option to determine
   * if the option can be selected. By default all options can be
   * selected.
   */
  isOptionEnabled?: OptionEnabledCallback<T>;

  /**
   * Optionally the error message to render.
   */
  error?: React.ReactNode;

  /**
   * Optionally the color of the FormGroup.
   */
  color?: Color;

  /**
   * Whether or not the form element is currently valid.
   */
  valid?: boolean;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * The placeholder of the form element.
   */
  placeholder?: string;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;
}

interface WithoutLabel<T> extends BaseProps<T> {
  label?: never;
}

interface WithLabel<T> extends BaseProps<T> {
  /**
   * The label of the form element.
   */
  label: string;
}

export type Props<T> = WithoutLabel<T> | WithLabel<T>;

/**
 * RadioGroup is a form element for which the value can be selected
 * from a limited range.
 */
export default function RadioGroup<T>(props: Props<T>) {
  const {
    value,
    error,
    color,
    text = {},
    className = '',
    placeholder,
    onChange,
    onBlur,
    optionForValue,
    isOptionEqual
  } = props;

  const { options, loading } = useOptions({
    optionsOrFetcher: props.options,
    value,
    isOptionEqual,
    optionForValue
  });

  const isOptionEnabled = get(props, 'isOptionEnabled', constant(true));

  function onRadioClicked(option: T) {
    onChange(option);
    doBlur(onBlur);
  }

  return (
    <FormGroup tag="fieldset" className={className} color={color}>
      {'label' in props && props.label ? <legend>{props.label}</legend> : null}
      {placeholder ? (
        <p className="text-muted">
          <em>{placeholder}</em>
        </p>
      ) : null}
      {loading ? (
        <Loading>
          {t({
            key: 'RadioGroup.LOADING',
            fallback: 'Loading...',
            overrideText: text.loadingMessage
          })}
        </Loading>
      ) : (
        options.map(option => {
          const label = optionForValue(option);

          return (
            <FormGroup key={label} check>
              <Label check>
                <Input
                  type="radio"
                  value={label}
                  checked={isOptionSelected({
                    option,
                    optionForValue,
                    isOptionEqual,
                    value
                  })}
                  disabled={!isOptionEnabled(option)}
                  onChange={() => onRadioClicked(option)}
                />{' '}
                {label}
              </Label>
            </FormGroup>
          );
        })
      )}

      {error}
    </FormGroup>
  );
}
/**
 * Variant of the RadioGroup which can be used in a Jarb context.
 */
export const JarbRadioGroup = withJarb<any, any, Props<any>>(RadioGroup);
