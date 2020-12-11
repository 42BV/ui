import React, { useState } from 'react';
import { FormGroup, Label } from 'reactstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { FetchOptionsCallback, TypeaheadOption } from '../types';
import withJarb from '../../withJarb/withJarb';
import { doBlur } from '../../utils';
import { valueToTypeaheadOption } from '../utils';
import { OptionForValue } from '../../option';
import classNames from 'classnames';
import Tag from '../../../core/Tag/Tag';
import { FieldCompatible } from '../../types';
import { useId } from '../../../hooks/useId/useId';

type Props<T> = FieldCompatible<T[], T[] | undefined> & {
  /**
   * Callback to fetch the options to display to the user.
   */
  fetchOptions: FetchOptionsCallback<T>;

  /**
   * Callback to convert an value of type T to an option to show
   * to the user.
   */
  optionForValue: OptionForValue<T>;
};

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
    optionForValue,
    onFocus,
    valid,
    className = '',
    onChange,
    onBlur,
    fetchOptions
  } = props;

  const [options, setOptions] = useState<TypeaheadOption<T>[]>([]);
  const [isLoading, setLoading] = useState(false);

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

  async function doFetchOptions(query: string): Promise<void> {
    setLoading(true);

    const page = await fetchOptions(query);
    const options = page.content.map((value) =>
      valueToTypeaheadOption(value, optionForValue)
    );

    setLoading(false);
    setOptions(options);
  }

  let selected: TypeaheadOption<T>[] = [];
  if (value && value.length) {
    selected = value.map((v) => valueToTypeaheadOption(v, optionForValue));
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
          isLoading={isLoading}
          multiple={true}
          placeholder={placeholder}
          selected={selected}
          options={options}
          inputProps={{
            // @ts-expect-error The input props value works
            value,
            className: classNames('form-control', {
              'is-invalid': valid === false
            })
          }}
          onChange={doOnChange}
          onSearch={doFetchOptions}
          onFocus={onFocus}
          renderToken={(option, props, index) => (
            <Tag
              key={index}
              text={option.label}
              // @ts-expect-error The prop onRemove actually exists, the typings are wrong
              onRemove={() => props.onRemove(option)}
              className="align-self-center"
            />
          )}
        />
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
