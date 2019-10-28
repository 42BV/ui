import React, { Component } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import Datetime from 'react-datetime';
import { get, constant } from 'lodash';
import moment, { Moment } from 'moment';
import MaskedInput from 'react-text-mask';
import { Color } from '../types';

import { DateFormat, TimeFormat } from './types';

import { combineFormat, formatToMask, isDate } from './utils';

import withJarb from '../withJarb/withJarb';
import { doBlur } from '../utils';

/**
 * Callback which returns whether a date is selectable.
 */
export type IsDateAllowed = (date: Moment, selectedDate?: Moment) => boolean;

export interface Props {
  /**
   * The id of the form element.
   */
  id: string;

  /**
   * The label of the form element.
   */
  label?: string;

  /**
   * The placeholder of the form element.
   */
  placeholder: string;

  /**
   * The value that the form element currently has.
   */
  value?: Date;

  /**
   * The format for the date, follows Moment.js format.
   *
   * At least a DateFormat or TimeFormat should be defined, otherwise
   * an error occurs.
   *
   * @see https://momentjs.com/docs/#/displaying/format/
   */
  dateFormat: DateFormat;

  /**
   * The format for the time, follows Moment.js format.
   *
   * At least a TimeFormat or DateFormat should be defined, otherwise
   * an error occurs.
   *
   * @see https://momentjs.com/docs/#/displaying/format/
   */
  timeFormat: TimeFormat;

  /**
   * Optional Callback which returns whether a date is selectable.
   * Is ran for every date which is displayed. By defaults every
   * date can be selected.
   */
  isDateAllowed?: IsDateAllowed;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value: Date | null) => void;

  /**
   * Optional callback for when the form element is blurred.
   */
  onBlur?: () => void;

  /**
   * Optional callback for when the form element is focused.
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
   * Optionally the locale moment js should use.
   */
  locale?: string;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
}

interface State {
  hasFormatError: boolean;
}

/**
 * DateTimeInput is a form element which allows the user to select:
 * date and times, times, and dates.
 */
export default class DateTimeInput extends Component<Props, State> {
  state = {
    hasFormatError: false
  };

  inputRef = undefined;

  // Is either a valid momentjs object when selected via picker,
  // or a string when the user typed in a value manually.
  onChange(value: string | Moment) {
    const { dateFormat, timeFormat } = this.props;

    if (typeof value === 'string') {
      if (isDate(value, dateFormat, timeFormat)) {
        const date = moment(
          value.trim(), // value includes an empty char at the back for some reason.
          combineFormat(dateFormat, timeFormat)
        );

        this.props.onChange(date.toDate());
        this.setState({ hasFormatError: false });
      } else {
        this.props.onChange(null);

        this.setState({ hasFormatError: true });
      }
    } else {
      this.props.onChange(value.toDate());
      doBlur(this.props.onBlur);
      this.setState({ hasFormatError: false });
    }
  }

  componentDidMount() {
    const { dateFormat, timeFormat } = this.props;

    if (!dateFormat && !timeFormat) {
      throw new Error(
        'DateTimeInput: dateFormat and timeFormat cannot both be false. This is a programmer error.'
      );
    }
  }

  render() {
    const {
      id,
      label,
      placeholder,
      dateFormat,
      timeFormat,
      color,
      valid,
      value,
      error,
      locale,
      onFocus,
      className = ''
    } = this.props;

    const { hasFormatError } = this.state;
    const format = combineFormat(dateFormat, timeFormat);
    const isDateAllowed = get(this.props, 'isDateAllowed', constant(true));

    return (
      <FormGroup className={`date-time-input ${className}`} color={color}>
        {label ? (
          <Label for={id}>
            {label}{' '}
            <span
              className={`date-time-input-format ${
                hasFormatError ? 'text-danger' : 'text-muted'
              }`}
            >
              ({format})
            </span>
          </Label>
        ) : null}
        <Datetime
          inputProps={{
            // TODO: Figure out if we should do this the hacky way
            // @see documentation react-datetime
            // @ts-ignore
            mask: formatToMask(dateFormat, timeFormat),
            placeholder,
            invalid: valid === false || hasFormatError
          }}
          renderInput={maskedInput}
          onChange={x => this.onChange(x)}
          onFocus={onFocus}
          value={value}
          dateFormat={dateFormat}
          timeFormat={timeFormat}
          closeOnSelect={true}
          locale={locale}
          isValidDate={(date: Moment, current?: Moment) =>
            isDateAllowed(date, current)
          }
        />
        {error}
      </FormGroup>
    );
  }
}

/**
 * Variant of the DateTimeInput which can be used in a Jarb context.
 */
export const JarbDateTimeInput = withJarb<Date, Date | null, Props>(
  DateTimeInput
);

export function maskedInput(props: {}) {
  return <MaskedInput {...props} render={reactStrapInput} />;
}

export function reactStrapInput(
  ref: (input: HTMLInputElement) => void,
  props: Record<string, any>
) {
  return <Input innerRef={ref} {...props} />;
}
