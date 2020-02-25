import React from 'react';
import { FormGroup, Input as RSInput, Label } from 'reactstrap';
import { constant, get } from 'lodash';
import { InputType } from 'reactstrap/lib/Input';

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
import { useOptions } from '../useOptions';
import Loading from '../../core/Loading/Loading';

export interface Text {
  /**
   * The message to show when the select is loading. Defaults
   * to `loading...`
   */
  loadingMessage?: string;
}

interface BaseProps<T> {
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
  id?: string;
  label?: never;
}

interface WithLabel<T> extends BaseProps<T> {
  /**
   * The id of the form element.
   */
  id: string;

  /**
   * The label of the form element.
   */
  label: string;
}

export type Props<T> = WithoutLabel<T> | WithLabel<T>;

/**
 * Select is a form element for which the value can be selected
 * from a limited range.
 */
export default function Select<T>(props: Props<T>) {
  const {
    value,
    error,
    color,
    text = {},
    className = '',
    valid,
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

  function selectDefaultOption(option?: HTMLOptionElement | null) {
    // select the default option when no other option is chosen.
    if (option && value === undefined) {
      option.selected = true;
    }
  }

  const isOptionEnabled = get(props, 'isOptionEnabled', constant(true));
  const inputProps = {
    id: 'id' in props ? props.id : undefined,
    valid,
    invalid: valid === false ? true : undefined,
    type: 'select' as InputType,
    placeholder,
    onChange: (event: { target: { value: string } }) => {
      const index = parseInt(event.target.value, 10);
      onChange(options[index]);
    },
    onBlur,
    className: value === undefined ? 'showing-placeholder' : ''
  };

  const indexOfValue =
    value !== undefined
      ? options.findIndex(option =>
          isOptionSelected({ option, optionForValue, isOptionEqual, value })
        )
      : undefined;

  return (
    <FormGroup className={className} color={color}>
      {'label' in props && props.label ? (
        <Label for={props.id}>{props.label}</Label>
      ) : null}
      {loading ? (
        <Loading className="mt-2">
          {t({
            key: 'Select.LOADING',
            fallback: 'Loading...',
            overrideText: text.loadingMessage
          })}
        </Loading>
      ) : (
        <RSInput
          value={indexOfValue === -1 ? undefined : indexOfValue}
          {...inputProps}
        >
          <option ref={option => selectDefaultOption(option)}>
            {placeholder}
          </option>

          {options.map((option, index) => {
            const label = optionForValue(option);

            return (
              <option
                key={label}
                // @ts-ignore
                value={index}
                disabled={!isOptionEnabled(option)}
              >
                {label}
              </option>
            );
          })}
        </RSInput>
      )}

      {error}
    </FormGroup>
  );
}

/**
 * Variant of the Select which can be used in a Jarb context.
 */
export const JarbSelect = withJarb<any, any, Props<any>>(Select);
