import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import { constant, get } from 'lodash';

import withJarb from '../withJarb/withJarb';
import { t } from '../../utilities/translation/translation';
import { isOptionSelected, keyForOption } from '../option';
import { doBlur } from '../utils';
import Loading from '../../core/Loading/Loading';
import { useOptions } from '../useOptions';
import TextButton from '../../core/TextButton/TextButton';
import { FieldWithOptionsCompatible } from '../types';

export type Text = {
  /**
   * The message to show when the form element is loading.
   * Defaults to `loading...`
   */
  loadingMessage?: string;

  /**
   * The text of the clear button
   */
  clear?: string;
};

export type Props<T> = Omit<
  FieldWithOptionsCompatible<T, T | undefined>,
  'valid' | 'text'
> & {
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
};

/**
 * RadioGroup is a form element for which the value can be selected
 * from a limited range.
 */
export default function RadioGroup<T>(props: Props<T>) {
  const {
    id,
    label,
    value,
    onChange,
    onFocus,
    onBlur,
    error,
    placeholder,
    color,
    className = '',
    optionForValue,
    isOptionEqual,
    uniqueKeyForValue,
    text = {},
    watch,
    horizontal = false,
    canClear = false
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
                <Label check htmlFor={id}>
                  <Input
                    id={id}
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
                    onFocus={onFocus}
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
