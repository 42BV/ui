import React, { Component } from 'react';
import { FormGroup, Label } from 'reactstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { FetchOptionsCallback, TypeaheadOption } from '../types';
import withJarb from '../../withJarb/withJarb';
import { doBlur } from '../../utils';
import { valueToTypeaheadOption } from '../utils';
import { Color, OptionForValue } from '../../types';
import classNames from 'classnames';

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
  onChange: (value: T[] | undefined) => void;

  /**
   * Optional callback for when the form element is blurred.
   */
  onBlur?: () => void;

  /**
   * Callback for when the form element gets the focus.
   */
  onFocus?: () => void;

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
   * The value that the form element currently has.
   */
  value?: T[];

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
 * work with the system daily. This is a nice usecase for the TypeaheadMultiple
 * because the user can type in faster than the can select from a
 * ModalPickerMultiple.
 */
export default class TypeaheadMultiple<T> extends Component<
  Props<T>,
  State<T>
> {
  state = {
    options: [],
    isLoading: false
  };

  onChange(values: TypeaheadOption<T>[]) {
    if (values.length === 0) {
      this.props.onChange(undefined);
    } else {
      this.props.onChange(values.map(option => option.value));
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
  }

  render() {
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
      className = ''
    } = this.props;

    let selected: TypeaheadOption<T>[] = [];
    if (value && value.length) {
      selected = value.map(v => valueToTypeaheadOption(v, optionForValue));
    }

    const classes = classNames(className, {
      'is-invalid': valid === false
    });

    return (
      <FormGroup className={classes} color={color}>
        <Label for={id}>{label}</Label>
        <div className={selected.length === 0 ? 'showing-placeholder' : ''}>
          <AsyncTypeahead
            id={id}
            isLoading={this.state.isLoading}
            multiple={true}
            placeholder={placeholder}
            selected={selected}
            options={this.state.options}
            // @ts-ignore
            inputProps={{
              // @ts-ignore
              value: value,
              className: classNames('form-control', {
                'is-invalid': valid === false
              })
            }}
            onChange={value => this.onChange(value)}
            onSearch={query => this.fetchOptions(query)}
            onFocus={onFocus}
          />
        </div>
        {error}
      </FormGroup>
    );
  }
}

/**
 * Variant of the TypeaheadMultiple which can be used in a Jarb context.
 */
export const JarbTypeaheadMultiple = withJarb<any[], any[] | undefined, Props<any>>(
  TypeaheadMultiple
);
