import React, { useState } from 'react';
import { FormGroup, Label } from 'reactstrap';
import {
  AsyncTypeahead,
  TokenProps,
  Typeahead,
  TypeaheadProps
} from 'react-bootstrap-typeahead';
import { TypeaheadOption } from '../types';
import withJarb from '../../withJarb/withJarb';
import { doBlur, alwaysTrue } from '../../utils';
import { optionToTypeaheadOption } from '../utils';
import {
  FieldCompatibleWithPredeterminedOptions,
  isOptionSelected
} from '../../option';
import classNames from 'classnames';
import Tag from '../../../core/Tag/Tag';
import { FieldCompatible } from '../../types';
import { useId } from '../../../hooks/useId/useId';
import { useOptions } from '../../useOptions';

type Props<T> = FieldCompatible<T[], T[] | undefined> &
  FieldCompatibleWithPredeterminedOptions<T>;

/**
 * The TypeaheadMultiple is a form element which allows the user
 * to select multiple options by searching for them and selecting
 * them.
 *
 * The use case is that when there are too many options to render
 * in a simple Select you can use the TypeaheadMultiple.
 *
 * Use the TypeaheadMultiple when the user knows which options he / she
 * wants to select beforehand. Scenario: you are building a system
 * for a trading company, the users need to enter some trading code
 * from a big list. The users know each code by heart since they
 * work with the system daily. This is a nice use case for the TypeaheadMultiple
 * because the user can type in faster than the can select from a
 * ModalPickerMultiple.
 */
export default function TypeaheadMultiple<T>(props: Props<T>) {
  const {
    id,
    label,
    placeholder,
    value,
    color,
    error,
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

  function doOnChange(values: TypeaheadOption<T>[]): void {
    if (values.length === 0) {
      onChange(undefined);
    } else {
      onChange(values.map((option) => option.value));
    }

    // Due this: https://github.com/ericgio/react-bootstrap-typeahead/issues/224
    // If we invoke the input.onBlur at the typeahead onblur you would get this:
    // onBlur -> onChange, but it should be the other way around.
    // onBlur Should be called when the user navigates away from the input.
    // In this case when the user selects an item (onChange).
    doBlur(onBlur);
  }

  function renderToken(
    option: TypeaheadOption<T>,
    props: TokenProps,
    index: number
  ) {
    return (
      <Tag
        key={index}
        text={option.label}
        // @ts-expect-error The prop onRemove actually exists, the typings are wrong
        onRemove={() => props.onRemove(option)}
        className="align-self-center"
      />
    );
  }

  let selected: TypeaheadOption<T>[] = [];
  if (value && value.length) {
    selected = value.map((v) => optionToTypeaheadOption(v, labelForOption));
  }

  const classes = classNames(className, {
    'is-invalid': valid === false
  });

  const innerId = useId({ id });

  const typeaheadProps: TypeaheadProps<TypeaheadOption<T>> = {
    id,
    filterBy: alwaysTrue,
    multiple: true,
    placeholder,
    selected,
    options: typeaheadOptions,
    onChange: doOnChange,
    onFocus,
    inputProps: {
      // @ts-expect-error The input props value works
      value,
      className: classNames('form-control', {
        'is-invalid': valid === false
      })
    },
    renderToken
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
 * Variant of the TypeaheadMultiple which can be used in a Jarb context.
 */
export const JarbTypeaheadMultiple = withJarb<
  any[],
  any[] | undefined,
  Props<any>
>(TypeaheadMultiple);
