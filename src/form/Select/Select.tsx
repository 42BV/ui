import React, { Component } from 'react';
import { FormGroup, Label, Input as RSInput } from 'reactstrap';
import { get, constant, isArray } from 'lodash';
import { InputType } from 'reactstrap/lib/Input';
import { Page } from '@42.nl/spring-connect';

import withJarb from '../withJarb/withJarb';
import Spinner from '../../core/Spinner/Spinner';
import { Color } from '../types';
import { getTranslator } from '../translator';

/**
 * Callback to determine if the option is currently enabled.
 */
export type OptionEnabledCallback<T> = (option: T) => boolean;

/**
 * Callback which should return a Page of options which can
 * be selected by the user.
 */
type OptionsFetcher<T> = () => Promise<Page<T>>;

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
   * Callback for when the form element changes.
   */
  onChange: (value: T) => void;

  /**
   * Optional callback for when the form element is blurred.
   */
  onBlur?: () => void;

  /**
   * Is either an array of options or a callback which fetches
   * the options asynchronously.
   */
  options: OptionsFetcher<T> | T[];

  /**
   * Callback to convert an value of type T to an option to show
   * to the user.
   */
  optionForValue: (value: T) => string;

  /**
   * Optional callback which is called for every option to determine
   * if the option can be selected. By default all options can be
   * selected.
   */
  isOptionEnabled?: OptionEnabledCallback<T>;

  /**
   * The message to show when the select is loading. Defaults
   * to `loading...`
   */
  loadingMessage?: string;

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

interface State<T> {
  options: T[];
  loading: boolean;
}

/**
 * Select is a form element for which the value can be selected
 * from a limited range.
 */
export default class Select<T> extends Component<Props<T>, State<T>> {
  constructor(props: Props<T>) {
    super(props);

    const { options } = props;

    if (isArray(options)) {
      this.state = {
        options,
        loading: false
      };
    } else {
      this.state = {
        options: [],
        loading: true
      };
    }
  }

  async componentDidMount() {
    const options = this.props.options;

    if (isArray(options) === false) {
      const fetcher = options as OptionsFetcher<T>;

      const page: Page<T> = await fetcher();

      this.setState({ options: page.content, loading: false });

      this.props.onChange(page.content[0]);
    }
  }

  selectDefaultOption(option?: HTMLOptionElement | null) {
    // select the default option when no other option is chosen.
    if (option && this.props.value === undefined) {
      option.selected = true;
    }
  }

  render() {
    const translator = getTranslator();

    const {
      id,
      label,
      error,
      color,
      loadingMessage = translator({
        key: 'Select.LOADING',
        fallback: 'Loading...'
      }),
      className = ''
    } = this.props;

    const { loading } = this.state;

    return (
      <FormGroup className={className} color={color}>
        <Label for={id}>{label}</Label>
        {loading ? (
          <div>
            <Spinner color="black" size={16} /> <span>{loadingMessage}</span>
          </div>
        ) : (
          this.renderInput()
        )}

        {error}
      </FormGroup>
    );
  }

  renderInput() {
    const {
      id,
      placeholder,
      value,
      valid,
      onBlur,
      onChange,
      optionForValue
    } = this.props;

    const { options } = this.state;

    const isOptionEnabled = get(this.props, 'isOptionEnabled', constant(true));

    const inputProps = {
      id,
      valid,
      type: 'select' as InputType,
      placeholder: placeholder,
      onChange: (event: { target: { value: string } }) => {
        const index = parseInt(event.target.value, 10);
        onChange(options[index]);
      },
      onBlur,
      className: value === undefined ? 'showing-placeholder' : ''
    };

    // @ts-ignore
    const indexOfValue = options.findIndex(option => option === value);

    return (
      <RSInput value={indexOfValue} {...inputProps}>
        <option disabled ref={option => this.selectDefaultOption(option)}>
          {placeholder}
        </option>

        {options.map((option, index) => {
          const label = optionForValue(option);

          return (
            <option
              key={label}
              // @ts-ignore
              value={index}
              disabled={!isOptionEnabled(option)}
            >
              {label}
            </option>
          );
        })}
      </RSInput>
    );
  }
}
/**
 * Variant of the Select which can be used in a Jarb context.
 */
export const JarbSelect = withJarb<string, string, Props<any>>(Select);
