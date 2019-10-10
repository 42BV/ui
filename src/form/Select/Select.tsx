import React, { Component } from 'react';
import { FormGroup, Label, Input as RSInput } from 'reactstrap';
import { get, constant, isArray } from 'lodash';
import { InputType } from 'reactstrap/lib/Input';
import { Page } from '@42.nl/spring-connect';

import withJarb from '../withJarb/withJarb';
import Spinner from '../../core/Spinner/Spinner';
import {
  Color,
  OptionForValue,
  OptionEnabledCallback,
  OptionsFetcher
} from '../types';
import { t } from '../../utilities/translation/translation';

export interface Text {
  /**
   * The message to show when the select is loading. Defaults
   * to `loading...`
   */
  loadingMessage?: string;
}
interface Props<T> {
  /**
   * The id of the form element.
   */
  id: string;

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
  optionForValue: OptionForValue<T>;

  /**
   * Optional callback which is called for every option to determine
   * if the option can be selected. By default all options can be
   * selected.
   */
  isOptionEnabled?: OptionEnabledCallback<T>;

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

  /**
   * The label of the form element.
   */
  label: string;

  /**
   * The placeholder of the form element.
   */
  placeholder: string;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;
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

      this.setInitialValueAfterloadingOptions(page);
    }
  }

  setInitialValueAfterloadingOptions(page: Page<T>) {
    const { value, optionForValue } = this.props;

    // If there is a value try to see if it is still in the content
    if (value) {
      const label = optionForValue(value);

      if (!page.content.some(item => optionForValue(item) === label)) {
        // The value no longer appears in the options, so we select
        // the first option by default, overriding any value it
        // had already.
        this.props.onChange(page.content[0]);
      }
    } else {
      // If there is no value, select the first option by default
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
    const { id, error, color, label, text = {}, className = '' } = this.props;
    const { loading } = this.state;

    return (
      <FormGroup className={className} color={color}>
        <Label for={id}>{label}</Label>
        {loading ? (
          <div>
            <Spinner color="black" size={16} />
            <span>
              {t({
                key: 'Select.LOADING',
                fallback: 'Loading...',
                overrideText: text.loadingMessage
              })}
            </span>
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
      invalid: valid === false ? true : undefined,
      type: 'select' as InputType,
      placeholder,
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
