import React from 'react';
import { FormGroup, Input, InputGroup, Label } from 'reactstrap';
import Datetime from 'react-datetime';
import { constant, get, isEmpty } from 'lodash';
import moment, { Moment } from 'moment';
import MaskedInput from 'react-text-mask';
import { Color } from '../types';

import { DateFormat, TimeFormat } from './types';

import { combineFormat, formatToMask, isDate } from './utils';

import withJarb from '../withJarb/withJarb';
import { doBlur } from '../utils';
import { DateTimeModal, Text } from './DateTimeModal/DateTimeModal';
import classNames from 'classnames';
import { useHasFormatError } from './useHasFormatError/useHasFormatError';
import { useIsModalOpen } from './useIsModalOpen/useIsModalOpen';
import Addon from '../Input/Addon/Addon';

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
  label?: React.ReactNode;

  /**
   * The placeholder of the form element.
   */
  placeholder?: string;

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
   * Is ran for every date which is displayed. By default every
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

  /**
   * Whether or not the date picker should be displayed in a modal.
   * Defaults to opening in a tooltip-like layout.
   */
  mode?: 'modal' | 'default';

  /**
   * Optionally customized text within the DateTimeModal component.
   * This text should already be translated.
   */
  text?: Text;
}

/**
 * DateTimeInput is a form element which allows the user to select:
 * date and times, times, and dates.
 */
export default function DateTimeInput(props: Props) {
  const [hasFormatError, setHasFormatError] = useHasFormatError();
  const [isModalOpen, setIsModalOpen] = useIsModalOpen();

  const {
    id,
    label,
    placeholder,
    valid,
    onFocus,
    dateFormat,
    timeFormat,
    color,
    value,
    error,
    locale,
    mode = 'default',
    text,
    className = ''
  } = props;

  const isDateAllowed = get(props, 'isDateAllowed', constant(true));

  if (!dateFormat && !timeFormat) {
    throw new Error(
      'DateTimeInput: dateFormat and timeFormat cannot both be false. This is a programmer error.'
    );
  }

  // Is either a valid MomentJS object when selected via picker,
  // or a string when the user typed in a value manually.
  function onChange(value: string | Moment) {
    const { onChange, onBlur } = props;

    if (typeof value === 'string') {
      if (isDate(value, dateFormat, timeFormat)) {
        const date = moment(
          value.trim(), // value includes an empty char at the back for some reason.
          combineFormat(dateFormat, timeFormat)
        );

        onChange(date.toDate());
        setHasFormatError(false);
      } else {
        onChange(null);
        setHasFormatError(!isEmpty(value));
      }
    } else {
      onChange(value.toDate());
      doBlur(onBlur);
      setHasFormatError(false);
    }

    setIsModalOpen(false);
  }

  const formGroupClassName = classNames('date-time-input', className, {
    'with-modal': mode === 'modal'
  });

  return (
    <FormGroup className={formGroupClassName} color={color}>
      {label ? (
        <Label for={id}>
          {label}{' '}
          <span
            className={`date-time-input-format ${
              value && hasFormatError ? 'text-danger' : 'text-muted'
            }`}
          >
            ({combineFormat(dateFormat, timeFormat)})
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
        open={mode === 'modal' ? false : undefined}
        renderInput={props =>
          mode === 'modal'
            ? maskedInputGroup(props, () => setIsModalOpen(true))
            : maskedInput(props)
        }
        onChange={onChange}
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
      {mode === 'modal' ? (
        <DateTimeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={onChange}
          dateFormat={dateFormat}
          timeFormat={timeFormat}
          defaultValue={value}
          isDateAllowed={isDateAllowed}
          label={placeholder}
          locale={locale}
          text={text}
        />
      ) : null}
    </FormGroup>
  );
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

export function maskedInputGroup(props: {}, onClick: () => void) {
  return (
    <InputGroup>
      <MaskedInput {...props} render={reactStrapInput} />
      <Addon position="right" onClick={onClick} icon="calendar_today" />
    </InputGroup>
  );
}

export function reactStrapInput(
  ref: (input: HTMLInputElement) => void,
  props: Record<string, any>
) {
  return <Input innerRef={ref} {...props} />;
}
