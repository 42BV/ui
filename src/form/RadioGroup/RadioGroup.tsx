import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

import { withJarb } from '../withJarb/withJarb';
import { t } from '../../utilities/translation/translation';
import {
  FieldCompatibleWithPredeterminedOptions,
  isOptionSelected,
  getKeyForOption
} from '../option';
import { alwaysTrue, doBlur } from '../utils';
import { Loading } from '../../core/Loading/Loading';
import { useOptions } from '../useOptions';
import { TextButton } from '../../core/TextButton/TextButton';
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

export type Props<T> = FieldCompatible<T, T | undefined> &
  FieldCompatibleWithPredeterminedOptions<T> & {
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
 *
 * If you pass a callback to the options property, be aware
 * that only 100 options will be displayed without pagination.
 * If you want to display more than 100 options,
 * you should use the ModalPickerSingle instead.
 */
export function RadioGroup<T>(props: Props<T>) {
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
    options,
    keyForOption,
    labelForOption,
    isOptionEqual,
    horizontal = false,
    canClear = false,
    isOptionEnabled = alwaysTrue,
    reloadOptions
  } = props;

  const { page, loading } = useOptions({
    options,
    value,
    isOptionEqual,
    labelForOption,
    reloadOptions,
    pageNumber: 1,
    query: '',
    size: Array.isArray(options) ? options.length : 100,
    optionsShouldAlwaysContainValue: true
  });

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

          {page.content.map((option) => {
            const label = labelForOption(option);
            const key = getKeyForOption({
              option,
              keyForOption,
              labelForOption
            });

            const isSelected = isOptionSelected({
              option,
              keyForOption,
              labelForOption,
              isOptionEqual,
              value
            });

            return (
              <FormGroup key={key} check inline={horizontal}>
                <Label check>
                  <Input
                    type="radio"
                    value={label}
                    checked={isSelected}
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
