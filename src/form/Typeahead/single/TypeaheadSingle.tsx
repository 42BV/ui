import React, { useState } from 'react';
import { FormGroup, Label } from 'reactstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { find } from 'lodash';
import { FetchOptionsCallback, TypeaheadOption } from '../types';
import withJarb from '../../withJarb/withJarb';
import { doBlur } from '../../utils';
import { valueToTypeaheadOption } from '../utils';
import { OptionForValue } from '../../option';
import classNames from 'classnames';
import { FieldCompatible } from '../../types';
import { useId } from '../../../hooks/useId/useId';

type Props<T> = FieldCompatible<T, T | undefined> & {
  /**
   * Callback to fetch the options to display to the user.
   */
  options: FetchOptionsCallback<T>;

  /**
   * Callback to convert an value of type T to an option to show
   * to the user.
   */
  optionForValue: OptionForValue<T>;
};

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
    value,
    onChange,
    onFocus,
    onBlur,
    valid,
    error,
    placeholder,
    color,
    className = '',
    options: fetchOptions,
    optionForValue
  } = props;

  const [options, setOptions] = useState<TypeaheadOption<T>[]>([]);
  const [isLoading, setLoading] = useState(false);

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

  async function doFetchOptions(query: string) {
    setLoading(true);

    const page = await fetchOptions(query);
    const options = page.content.map((value) =>
      valueToTypeaheadOption(value, optionForValue)
    );

    setOptions(options);
    setLoading(false);

    const selectedValue = find(
      options,
      ({ label }) => label.toLowerCase() === query.toLowerCase()
    );

    if (selectedValue) {
      onChange(selectedValue.value);
    } else {
      onChange(undefined);
    }
  }

  const selected: TypeaheadOption<T>[] = [];
  if (value) {
    const option = valueToTypeaheadOption(value, optionForValue);
    selected.push(option);
  }

  const classes = classNames(className, {
    'is-invalid': valid === false
  });

  const innerId = useId({ id });

  return (
    <FormGroup className={classes} color={color}>
      {label ? <Label for={innerId}>{label}</Label> : null}
      <div className={selected.length === 0 ? 'showing-placeholder' : ''}>
        <AsyncTypeahead
          id={id}
          labelKey="label"
          isLoading={isLoading}
          multiple={false}
          placeholder={placeholder}
          selected={selected}
          options={options}
          onSearch={doFetchOptions}
          onChange={doOnChange}
          onFocus={onFocus}
          inputProps={{
            className: classNames('form-control', {
              'is-invalid': valid === false
            })
          }}
        />
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
