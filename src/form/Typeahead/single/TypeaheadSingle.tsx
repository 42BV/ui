import classNames from 'classnames';
import React, { useState } from 'react';
import {
  AsyncTypeahead,
  Typeahead,
  TypeaheadProps
} from 'react-bootstrap-typeahead';
import { FormGroup, Label } from 'reactstrap';
import { useId } from '../../../hooks/useId/useId';
import {
  FieldCompatibleWithPredeterminedOptions,
  isOptionSelected
} from '../../option';
import { FieldCompatible } from '../../types';
import { useOptions } from '../../useOptions';
import { doBlur, alwaysTrue } from '../../utils';
import withJarb from '../../withJarb/withJarb';
import { TypeaheadOption } from '../types';
import { optionToTypeaheadOption } from '../utils';
import { useAutoSelectOptionWhenQueryMatchesExactly } from './useAutoSelectOptionWhenQueryMatchesExactly';

type Props<T> = FieldCompatible<T, T | undefined> &
  FieldCompatibleWithPredeterminedOptions<T>;

/**
 * The TypeaheadSingle is a form element which allows the user
 * to select an option by searching for them and selecting
 * them.
 *
 * The use case is that when there are too many options to render
 * in a simple Select you can use the TypeaheadSingle.
 *
 * Use the TypeaheadSingle when the user knows which option he / she
 * wants to select beforehand. Scenario: you are building a system
 * for a trading company, the users need to enter some trading code
 * from a big list. The users know each code by heart since they
 * work with the system daily. This is a nice use case for the TypeaheadSingle
 * because the user can type in faster than the can select from a
 * ModalPickerSingle.
 */
export default function TypeaheadSingle<T>(props: Props<T>) {
  const {
    id,
    label,
    placeholder,
    error,
    value,
    color,
    labelForOption,
    onFocus,
    valid,
    className = '',
    onChange,
    onBlur,
    options,
    keyForOption,
    isOptionEqual,
    reloadOptions,
    isOptionEnabled = alwaysTrue
  } = props;

  const [query, setQuery] = useState('');

  const { page, loading } = useOptions<T>({
    options,
    value,
    keyForOption,
    isOptionEqual,
    labelForOption,
    reloadOptions,
    query,
    pageNumber: 1,
    size: 10,
    optionsShouldAlwaysContainValue: false
  });

  const typeaheadOptions = page.content
    .filter((option) => isOptionEnabled(option))
    .filter(
      (option) =>
        !isOptionSelected({
          option,
          keyForOption,
          labelForOption,
          isOptionEqual,
          value
        })
    )
    .map((option) => optionToTypeaheadOption(option, labelForOption));

  function doOnChange(values: TypeaheadOption<T>[]) {
    if (values.length === 0) {
      onChange(undefined);
    } else {
      const selectedOption = values[0];

      onChange(selectedOption.value);
    }

    // Due this: https://github.com/ericgio/react-bootstrap-typeahead/issues/224
    // If we invoke the input.onBlur at the typeahead onblur you would get this:
    // onBlur -> onChange, but it should be the other way around.
    // onBlur Should be called when the user navigates away from the input.
    // In this case when the user selects an item (onChange).
    doBlur(onBlur);
  }

  useAutoSelectOptionWhenQueryMatchesExactly({
    typeaheadOptions,
    onChange,
    query
  });

  const selected: TypeaheadOption<T>[] = [];
  if (value) {
    const option = optionToTypeaheadOption(value, labelForOption);
    selected.push(option);
  }

  const classes = classNames(className, {
    'is-invalid': valid === false
  });

  const innerId = useId({ id });

  const typeaheadProps: TypeaheadProps<TypeaheadOption<T>> = {
    id,
    filterBy: alwaysTrue,
    multiple: false,
    placeholder,
    selected,
    options: typeaheadOptions,
    onChange: doOnChange,
    onFocus,
    inputProps: {
      className: classNames('form-control', {
        'is-invalid': valid === false
      })
    }
  };

  return (
    <FormGroup className={classes} color={color}>
      {label ? <Label for={innerId}>{label}</Label> : null}
      <div className={selected.length === 0 ? 'showing-placeholder' : ''}>
        {Array.isArray(options) ? (
          <Typeahead {...typeaheadProps} onInputChange={setQuery} />
        ) : (
          <AsyncTypeahead
            {...typeaheadProps}
            isLoading={loading}
            delay={200}
            onSearch={setQuery}
          />
        )}
      </div>
      {error}
    </FormGroup>
  );
}

/**
 * Variant of the TypeaheadSingle which can be used in a Jarb context.
 */
export const JarbTypeaheadSingle = withJarb<any, any | null, Props<any>>(
  TypeaheadSingle
);
