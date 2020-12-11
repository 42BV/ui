import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import { constant, get } from 'lodash';

import withJarb from '../withJarb/withJarb';
import { t } from '../../utilities/translation/translation';
import {
  isOptionSelected,
  keyForOption,
  OptionEnabledCallback,
  OptionEqual,
  OptionForValue,
  OptionsFetcher,
  UniqueKeyForValue
} from '../option';
import { doBlur } from '../utils';
import Loading from '../../core/Loading/Loading';
import { useOptions } from '../useOptions';
import TextButton from '../../core/TextButton/TextButton';
import { FieldCompatible } from '../types';

export type Text = {
  /**
   * The message to show when the select is loading. Defaults
   * to `loading...`
   */
  loadingMessage?: string;

  /**
   * The text of the clear button
   */
  clear?: string;
};

export type Props<T> = FieldCompatible<T, T | undefined> & {
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
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;

  /**
   * Whether or not to show the RadioGroup horizontally.
   *
   * Defaults to `false`
   */
  horizontal?: boolean;

  /**
   * Whether or not to show a "clear" button.
   *
   * Defaults to `false`
   */
  canClear?: boolean;

  /**
   * Optionally a value to detect changes and trigger
   * the optionsFetcher to reload the options.
   */
  watch?: any;

  /**
   * Optional callback to get a unique key for an item.
   * This is used to provide each option in the form element a unique key.
   * Defaults to the 'id' property if it exists, otherwise uses optionForValue.
   */
  uniqueKeyForValue?: UniqueKeyForValue<T>;
};

/**
 * RadioGroup is a form element for which the value can be selected
 * from a limited range.
 */
export default function RadioGroup<T>(props: Props<T>) {
  const {
    label,
    value,
    error,
    color,
    text = {},
    className = '',
    placeholder,
    onChange,
    onBlur,
    uniqueKeyForValue,
    optionForValue,
    isOptionEqual,
    horizontal = false,
    canClear = false,
    watch
  } = props;

  const { options, loading } = useOptions({
    optionsOrFetcher: props.options,
    value,
    isOptionEqual,
    optionForValue,
    watch
  });

  const isOptionEnabled = get(props, 'isOptionEnabled', constant(true));

  function onRadioClicked(option: T) {
    onChange(option);
    doBlur(onBlur);
  }

  return (
    <FormGroup
      tag="fieldset"
      className={'radio-group ' + className}
      color={color}
    >
      {label ? <legend>{label}</legend> : null}
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
        <>
          {canClear && value ? (
            <div className="mb-1">
              <TextButton onClick={() => onChange(undefined)}>
                {t({
                  key: 'RadioGroup.CLEAR',
                  fallback: 'Clear',
                  overrideText: text.clear
                })}
              </TextButton>
            </div>
          ) : null}

          {options.map((option) => {
            const label = optionForValue(option);
            const key = keyForOption({
              option,
              uniqueKeyForValue,
              optionForValue
            });

            return (
              <FormGroup key={key} check inline={horizontal}>
                <Label check>
                  <Input
                    type="radio"
                    value={label}
                    checked={isOptionSelected({
                      option,
                      uniqueKeyForValue,
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
          })}
        </>
      )}

      {error}
    </FormGroup>
  );
}
/**
 * Variant of the RadioGroup which can be used in a Jarb context.
 */
export const JarbRadioGroup = withJarb<any, any, Props<any>>(RadioGroup);
