import React, { Component } from 'react';
import { Col, FormGroup, Input as RSInput, Label, Row } from 'reactstrap';
import { chunk, constant, get, isArray, uniqueId } from 'lodash';

import { Page } from '@42.nl/spring-connect';

import withJarb from '../withJarb/withJarb';
import Spinner from '../../core/Spinner/Spinner';
import {
  isOptionSelected,
  keyForOption,
  OptionEnabledCallback,
  OptionEqual,
  OptionForValue,
  OptionsFetcher,
  UniqueKeyForValue
} from '../option';
import { t } from '../../utilities/translation/translation';
import { doBlur } from '../utils';
import { FieldCompatible } from '../types';

export type Text = {
  /**
   * The message to show when the CheckboxMultipleSelect is loading. Defaults
   * to `loading...`
   */
  loadingMessage?: string;
};

export type Props<T> = Omit<FieldCompatible<T[], T[]>, 'valid'> & {
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
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;

  /**
   * Whether or not to show the CheckboxMultipleSelect horizontally.
   *
   * Defaults to `false`
   */
  horizontal?: boolean;

  /**
   * Optional callback to get a unique key for an item.
   * This is used to provide each option in the form element a unique key.
   * Defaults to the 'id' property if it exists, otherwise uses optionForValue.
   */
  uniqueKeyForValue?: UniqueKeyForValue<T>;
};

type State<T> = {
  options: T[];
  loading: boolean;
};

/**
 * Select is a form element for which the value can be selected
 * from a limited range.
 */
export default class CheckboxMultipleSelect<T> extends Component<
  Props<T>,
  State<T>
> {
  /* istanbul ignore next */
  innerId = this?.props?.id ?? uniqueId();

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
    const {
      value,
      onChange,
      onBlur,
      uniqueKeyForValue,
      optionForValue
    } = this.props;

    // Always copy the `value` so the `selected` is a fresh array.
    // Otherwise the selection will be the same as the value, which
    // causes values to be committed and the cancel button will not
    // do anything.
    let selected = isArray(value) ? [...value] : [];

    if (isChecked) {
      const { isOptionEqual } = this.props;

      const filterFn = isOptionEqual
        ? (v: T) => !isOptionEqual(option, v)
        : (v: T) =>
            keyForOption({ option: v, uniqueKeyForValue, optionForValue }) !==
            keyForOption({ option, uniqueKeyForValue, optionForValue });

      selected = selected.filter(filterFn);
    } else {
      selected.push(option);
    }

    onChange(selected);

    doBlur(onBlur);
  }

  render() {
    const {
      label,
      error,
      color,
      text = {},
      className = '',
      placeholder
    } = this.props;
    const { loading } = this.state;

    return (
      <FormGroup className={className} color={color}>
        {label ? <Label for={this.innerId}>{label}</Label> : null}
        {placeholder ? (
          <p className="text-muted">
            <em>{placeholder}</em>
          </p>
        ) : null}
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
    const { horizontal = false } = this.props;

    if (horizontal) {
      return this.renderOptions(this.state.options, true);
    } else {
      const { options } = this.state;

      const chunks = chunk(options, 10);

      return (
        <Row>
          {chunks.map((options, index) => {
            return (
              <Col xs="auto" key={index} style={{ width: '300px' }}>
                {this.renderOptions(options, false)}
              </Col>
            );
          })}
        </Row>
      );
    }
  }

  renderOptions(options: T[], horizontal: boolean) {
    const {
      optionForValue,
      uniqueKeyForValue,
      value,
      isOptionEqual
    } = this.props;

    const isOptionEnabled = get(this.props, 'isOptionEnabled', constant(true));

    return options.map((option, index) => {
      const label = optionForValue(option);
      const key = keyForOption({ option, uniqueKeyForValue, optionForValue });

      const isChecked = isOptionSelected({
        option,
        uniqueKeyForValue,
        optionForValue,
        isOptionEqual,
        value
      });

      return (
        <FormGroup check key={key} inline={horizontal}>
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
    });
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
