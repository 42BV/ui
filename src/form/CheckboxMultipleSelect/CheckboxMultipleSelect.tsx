import React, { Component } from 'react';
import { FormGroup, Label, Input as RSInput, Row, Col } from 'reactstrap';
import { get, constant, isArray, chunk } from 'lodash';

import { Page } from '@42.nl/spring-connect';

import withJarb from '../withJarb/withJarb';
import Spinner from '../../core/Spinner/Spinner';
import { Color } from '../types';
import {
  OptionsFetcher,
  OptionEnabledCallback,
  OptionForValue,
  OptionEqual,
  isOptionSelected
} from '../option';
import { t } from '../../utilities/translation/translation';
import { doBlur } from '../utils';

export interface Text {
  /**
   * The message to show when the CheckboxMultipleSelect is loading. Defaults
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
  value?: T[];

  /**
   * Callback for when the form element changes.
   */
  onChange: (value: T[]) => void;

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
   * Optional callback which is used to determine if two options
   * of type T are equal.
   *
   * When `isOptionEqual` is not defined the outcome of `optionForValue`
   * is used to test equality.
   */
  isOptionEqual?: OptionEqual<T>;

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
export default class CheckboxMultipleSelect<T> extends Component<
  Props<T>,
  State<T>
> {
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
    }
  }

  optionClicked(option: T, isChecked: boolean) {
    const { value, onChange, onBlur } = this.props;

    // Always copy the `value` so the `selected` is a fresh array.
    // Otherwise the selection will be the same as the value, which
    // causes values to be commited and the cancel button will not
    // do anything.
    let selected = isArray(value) ? [...value] : [];

    if (isChecked) {
      selected = selected.filter(v => v !== option);
    } else {
      selected.push(option);
    }

    onChange(selected);

    doBlur(onBlur);
  }

  render() {
    const {
      id,
      error,
      color,
      label,
      text = {},
      className = '',
      placeholder
    } = this.props;
    const { loading } = this.state;

    return (
      <FormGroup className={className} color={color}>
        <Label for={id}>{label}</Label>
        <p className="text-muted">
          <em>{placeholder}</em>
        </p>
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
          this.renderCheckboxes()
        )}

        {error}
      </FormGroup>
    );
  }

  renderCheckboxes() {
    const { optionForValue, value, isOptionEqual } = this.props;

    const { options } = this.state;

    const chunks = chunk(options, 10);

    const isOptionEnabled = get(this.props, 'isOptionEnabled', constant(true));

    return (
      <Row>
        {chunks.map((options, index) => {
          return (
            <Col xs="auto" key={index} style={{ width: '300px' }}>
              {options.map((option, index) => {
                const label = optionForValue(option);

                const isChecked = isOptionSelected({
                  option,
                  optionForValue,
                  isOptionEqual,
                  value
                });

                return (
                  <FormGroup check key={label}>
                    <Label check>
                      <RSInput
                        type="checkbox"
                        checked={isChecked}
                        value={index}
                        disabled={!isOptionEnabled(option)}
                        onChange={() => this.optionClicked(option, isChecked)}
                      />{' '}
                      {label}
                    </Label>
                  </FormGroup>
                );
              })}
            </Col>
          );
        })}
      </Row>
    );
  }
}

/**
 * Variant of the CheckboxMultipleSelect which can be used in a Jarb context.
 */
export const JarbCheckboxMultipleSelect = withJarb<
  any[],
  any[] | null,
  Props<any>
>(CheckboxMultipleSelect);
