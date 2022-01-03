import React from 'react';
import { FormGroup, Input as RSInput, Label } from 'reactstrap';
import { InputType } from 'reactstrap/lib/Input';

import withJarb from '../withJarb/withJarb';
import { t } from '../../utilities/translation/translation';
import {
  FieldCompatibleWithPredeterminedOptions,
  isOptionSelected,
  getKeyForOption
} from '../option';
import { useOptions } from '../useOptions';
import Loading from '../../core/Loading/Loading';
import { useId } from '../../hooks/useId/useId';
import { FieldCompatible } from '../types';
import { alwaysTrue } from '../utils';

export type Text = {
  /**
   * The message to show when the select is loading. Defaults
   * to `loading...`
   */
  loadingMessage?: string;
};

export type Props<T> = FieldCompatible<T, T> &
  FieldCompatibleWithPredeterminedOptions<T> & {
    /**
     * Optionally customized text within the component.
     * This text should already be translated.
     */
    text?: Text;
  };

/**
 * Select is a form element for which the value can be selected
 * from a limited range.
 *
 * If you pass a callback to the options property, be aware
 * that only 100 options will be displayed without pagination.
 * If you want to display more than 100 options,
 * you should use the ModalPickerSingle instead.
 */
export default function Select<T>(props: Props<T>) {
  const {
    id,
    label,
    value,
    error,
    color,
    text = {},
    className = '',
    valid,
    placeholder,
    onChange,
    onBlur,
    options,
    isOptionEnabled = alwaysTrue,
    keyForOption,
    labelForOption,
    isOptionEqual,
    reloadOptions
  } = props;

  const { page, loading } = useOptions({
    options,
    value,
    keyForOption,
    isOptionEqual,
    labelForOption,
    reloadOptions,
    pageNumber: 1,
    query: '',
    size: Array.isArray(options) ? options.length : 100,
    optionsShouldAlwaysContainValue: true
  });

  function selectDefaultOption(option?: HTMLOptionElement | null) {
    // select the default option when no other option is chosen.
    if (option && value === undefined) {
      option.selected = true;
    }
  }

  const innerId = useId({ id });

  const inputProps = {
    id: innerId,
    valid,
    invalid: valid === false ? true : undefined,
    type: 'select' as InputType,
    placeholder,
    onChange: (event: { target: { value: string } }) => {
      const index = parseInt(event.target.value, 10);
      onChange(page.content[index]);
    },
    onBlur,
    className: value === undefined ? 'showing-placeholder' : ''
  };

  const indexOfValue =
    value !== undefined
      ? page.content.findIndex((option) =>
          isOptionSelected({
            option,
            keyForOption,
            labelForOption,
            isOptionEqual,
            value
          })
        )
      : undefined;

  return (
    <FormGroup className={className} color={color}>
      {label ? <Label for={innerId}>{label}</Label> : null}
      {loading ? (
        <Loading className="mt-2">
          {t({
            key: 'Select.LOADING',
            fallback: 'Loading...',
            overrideText: text.loadingMessage
          })}
        </Loading>
      ) : (
        <RSInput value={indexOfValue} {...inputProps}>
          {placeholder ? (
            <option ref={(option) => selectDefaultOption(option)}>
              {placeholder}
            </option>
          ) : null}

          {page.content.map((option, index) => {
            const optionLabel = labelForOption(option);
            const key = getKeyForOption({
              option,
              keyForOption,
              labelForOption
            });

            return (
              <option
                key={key}
                value={index}
                disabled={!isOptionEnabled(option)}
              >
                {optionLabel}
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
