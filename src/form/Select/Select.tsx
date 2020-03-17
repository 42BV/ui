import React from 'react';
import { FormGroup, Input as RSInput, Label } from 'reactstrap';
import { constant, get } from 'lodash';
import { InputType } from 'reactstrap/lib/Input';

import withJarb from '../withJarb/withJarb';
import { t } from '../../utilities/translation/translation';
import { isOptionSelected, keyForOption } from '../option';
import { useOptions } from '../useOptions';
import Loading from '../../core/Loading/Loading';
import { useId } from '../../hooks/useId/useId';
import { FieldWithOptionsCompatible } from '../types';

export type Props<T> = FieldWithOptionsCompatible<T, T>;

/**
 * Select is a form element for which the value can be selected
 * from a limited range.
 */
export default function Select<T>(props: Props<T>) {
  const {
    id,
    label,
    value,
    onChange,
    onFocus,
    onBlur,
    valid,
    error,
    placeholder,
    color,
    className = '',
    optionForValue,
    isOptionEqual,
    uniqueKeyForValue,
    text = {},
    watch
  } = props;

  const { options, loading } = useOptions({
    optionsOrFetcher: props.options,
    value,
    uniqueKeyForValue,
    isOptionEqual,
    optionForValue,
    watch
  });

  function selectDefaultOption(option?: HTMLOptionElement | null) {
    // select the default option when no other option is chosen.
    if (option && value === undefined) {
      option.selected = true;
    }
  }

  const innerId = useId({ id });

  const isOptionEnabled = get(props, 'isOptionEnabled', constant(true));
  const inputProps = {
    id: innerId,
    valid,
    invalid: valid === false ? true : undefined,
    type: 'select' as InputType,
    placeholder,
    onChange: (event: { target: { value: string } }) => {
      const index = parseInt(event.target.value, 10);
      onChange(options[index]);
    },
    onFocus,
    onBlur,
    className: value === undefined ? 'showing-placeholder' : ''
  };

  const indexOfValue =
    value !== undefined
      ? options.findIndex((option) =>
          isOptionSelected({
            option,
            uniqueKeyForValue,
            optionForValue,
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
        <RSInput
          value={indexOfValue === -1 ? undefined : indexOfValue}
          {...inputProps}
        >
          <option ref={(option) => selectDefaultOption(option)}>
            {placeholder}
          </option>

          {options.map((option, index) => {
            const label = optionForValue(option);
            const key = keyForOption({
              option,
              uniqueKeyForValue,
              optionForValue
            });

            return (
              <option
                key={key}
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
