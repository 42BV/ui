import React, { Component } from 'react';
import { FormGroup, Label } from 'reactstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { find } from 'lodash';
import { FetchOptionsCallback, TypeaheadOption } from '../types';
import withJarb from '../../withJarb/withJarb';
import { doBlur } from '../../utils';
import { valueToTypeaheadOption } from '../utils';
import { Color } from '../../types';
import { OptionForValue } from '../../option';
import classNames from 'classnames';

interface BaseProps<T> {
  /**
   * The placeholder of the form element.
   */
  placeholder?: string;

  /**
   * The value that the form element currently has.
   */
  value?: T;

  /**
   * Callback to fetch the options to display to the user.
   */
  fetchOptions: FetchOptionsCallback<T>;

  /**
   * Callback to convert an value of type T to an option to show
   * to the user.
   */
  optionForValue: OptionForValue<T>;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value: T | undefined) => void;

  /**
   * Callback for when the form element gets the focus.
   */
  onFocus?: () => void;

  /**
   * Optional callback for when the form element is blurred.
   */
  onBlur?: () => void;

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
  label: React.ReactNode;
}

export type Props<T> = WithoutLabel<T> | WithLabel<T>;

interface State<T> {
  options: TypeaheadOption<T>[];
  isLoading: boolean;
}

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
export default class TypeaheadSingle<T> extends Component<Props<T>, State<T>> {
  state = {
    options: [],
    isLoading: false
  };

  onChange(values: TypeaheadOption<T>[]) {
    if (values.length === 0) {
      this.props.onChange(undefined);
    } else {
      const selectedOption = values[0];

      this.props.onChange(selectedOption.value);
    }

    // Due this: https://github.com/ericgio/react-bootstrap-typeahead/issues/224
    // If we invoke the input.onBlur at the typeahead onblur you would get this:
    // onBlur -> onChange, but it should be the other way around.
    // onBlur Should be called when the user navigates away from the input.
    // In this case when the user selects an item (onChange).
    doBlur(this.props.onBlur);
  }

  async fetchOptions(query: string) {
    const { optionForValue } = this.props;

    this.setState({ isLoading: true });

    const page = await this.props.fetchOptions(query);
    const options = page.content.map(value =>
      valueToTypeaheadOption(value, optionForValue)
    );

    this.setState({ options, isLoading: false });
    const selectedValue = find(
      options,
      ({ label }) => label.toLowerCase() === query.toLowerCase()
    );

    if (selectedValue) {
      this.props.onChange(selectedValue.value);
    } else {
      this.props.onChange(undefined);
    }
  }

  render() {
    const {
      id,
      placeholder,
      error,
      value,
      color,
      optionForValue,
      onFocus,
      valid,
      className = '',
      ...props
    } = this.props;

    const selected: TypeaheadOption<T>[] = [];
    if (value) {
      const option = valueToTypeaheadOption(value, optionForValue);
      selected.push(option);
    }

    const classes = classNames(className, {
      'is-invalid': valid === false
    });

    return (
      <FormGroup className={classes} color={color}>
        {'label' in props && props.label ? (
          <Label for={id}>{props.label}</Label>
        ) : null}
        <div className={selected.length === 0 ? 'showing-placeholder' : ''}>
          <AsyncTypeahead
            id={id}
            labelKey="label"
            isLoading={this.state.isLoading}
            multiple={false}
            placeholder={placeholder}
            selected={selected}
            options={this.state.options}
            onSearch={query => this.fetchOptions(query)}
            onChange={value => this.onChange(value)}
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
}

/**
 * Variant of the TypeaheadSingle which can be used in a Jarb context.
 */
export const JarbTypeaheadSingle = withJarb<any, any | null, Props<any>>(
  TypeaheadSingle
);
