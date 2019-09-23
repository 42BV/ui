import React, { Component } from 'react';
import { FormGroup, Label } from 'reactstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { find } from 'lodash';
import { TypeaheadOption, FetchOptionsCallback } from '../types';
import withJarb from '../../withJarb/withJarb';
import { doBlur } from '../../utils';
import { valueToTypeaheadOption } from '../utils';
import { Color, OptionForValue } from '../../types';

interface Props<T> {
  /**
   * The id of the form element.
   */
  id: string;

  /**
   * The label of the form element.
   */
  label: string;

  /**
   * The placeholder of the form element.
   */
  placeholder: string;

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
  onChange: (value: T | null) => void;

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
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
}

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
 * work with the system daily. This is a nice usecase for the TypeaheadSingle
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
      this.props.onChange(null);
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

  async fetchOpions(query: string) {
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
      this.props.onChange(null);
    }
  }

  render() {
    const {
      id,
      label,
      placeholder,
      error,
      value,
      color,
      optionForValue,
      onFocus,
      className = ''
    } = this.props;

    const selected = [];
    if (value) {
      const option = valueToTypeaheadOption(value, optionForValue);
      selected.push(option);
    }

    return (
      <FormGroup className={className} color={color}>
        <Label for={id}>{label}</Label>
        <div className={selected.length === 0 ? 'showing-placeholder' : ''}>
          <AsyncTypeahead
            id={id}
            labelKey="label"
            isLoading={this.state.isLoading}
            multiple={false}
            placeholder={placeholder}
            selected={selected}
            options={this.state.options}
            onSearch={query => this.fetchOpions(query)}
            onChange={value => this.onChange(value)}
            onFocus={onFocus}
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
