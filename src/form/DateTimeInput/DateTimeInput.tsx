import React, { useState } from 'react';
import { FormGroup, Input, InputGroup, Label } from 'reactstrap';
import Datetime from 'react-datetime';
import { constant, get, uniqueId } from 'lodash';
import moment, { Moment } from 'moment';
import classNames from 'classnames';
import MaskedInput from 'react-text-mask';

import { DateFormat, TimeFormat } from './types';

import { combineFormat, formatToMask } from './utils';

import { withJarb } from '../withJarb/withJarb';
import { doBlur } from '../utils';
import { DateTimeModal, Text } from './DateTimeModal/DateTimeModal';
import { FieldCompatible } from '../types';
import { isDateValidator } from './validators';
import { isDate } from './checkers';
import { withField } from '../withField/withField';
import { Button } from '../../core/Button/Button';
import { Icon } from '../../core/Icon';
import { MomentInput } from 'moment/moment';

/**
 * Callback which returns whether a date is selectable.
 */
export type DateTimeInputIsDateAllowed = (
  date: Moment,
  selectedDate?: Moment
) => boolean;

export type DateTimeInputMode = 'modal' | 'default';

export type Props = FieldCompatible<Date | string, Date | string> & {
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
   * Is ran for every date which is displayed. By default, every
   * date can be selected.
   */
  isDateAllowed?: DateTimeInputIsDateAllowed;

  /**
   * Optionally the locale moment js should use.
   */
  locale?: string;

  /**
   * When true, input time values will be interpreted as UTC (Zulu time)
   * by Moment.js. Otherwise, they will default to the user's local
   * timezone.
   *
   * Defaults to true.
   */
  utc?: boolean;

  /**
   * Whether the date picker should be displayed in a modal.
   * Defaults to opening in a tooltip-like layout.
   */
  mode?: DateTimeInputMode;

  /**
   * Optionally customized text within the DateTimeModal component.
   * This text should already be translated.
   */
  text?: Text;
};

/**
 * DateTimeInput is a form element which allows the user to select:
 * date and times, times, and dates.
 */
export function DateTimeInput(props: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    id = uniqueId(),
    label,
    hiddenLabel,
    placeholder,
    valid,
    onFocus,
    onBlur,
    dateFormat,
    timeFormat,
    color,
    value,
    error,
    locale,
    utc = true,
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

  function onChange(newValue: string | Moment) {
    // newValue is either a valid Moment object when selected via
    // picker or the user typed in a valid date, or it is a string
    // when the user typed in a partial or invalid date manually.
    if (moment.isMoment(newValue)) {
      props.onChange(newValue.toDate());
      doBlur(onBlur);
    } else {
      props.onChange(newValue);
    }

    setIsModalOpen(false);
  }

  const formGroupClassName = classNames('date-time-input', className, {
    'with-modal': mode === 'modal'
  });

  return (
    <FormGroup className={formGroupClassName} color={color}>
      {!hiddenLabel || typeof label !== 'string' ? (
        <Label for={id}>
          {label}
          <span className="date-time-input-format text-muted">
            ({combineFormat(dateFormat, timeFormat)})
          </span>
        </Label>
      ) : null}
      <Datetime
        inputProps={{
          // @ts-expect-error Our input prop will have a mask because it is a `MaskedInput`.
          mask: formatToMask(dateFormat, timeFormat),
          placeholder,
          invalid: valid === false,
          id,
          autoComplete: 'off',
          'aria-label':
            hiddenLabel && typeof label === 'string' ? label : undefined
        }}
        open={mode === 'modal' ? false : undefined}
        renderInput={(inputProps) =>
          mode === 'modal'
            ? maskedInputGroup(inputProps, () => setIsModalOpen(true))
            : maskedInput(inputProps)
        }
        onChange={onChange}
        onOpen={onFocus}
        value={value}
        dateFormat={dateFormat}
        timeFormat={timeFormat}
        closeOnSelect={true}
        locale={locale}
        utc={utc}
        isValidDate={isDateAllowed}
      />
      {error}
      {mode === 'modal' && isModalOpen ? (
        <DateTimeModal
          onClose={() => setIsModalOpen(false)}
          onSave={onChange}
          dateFormat={dateFormat}
          timeFormat={timeFormat}
          defaultValue={
            value instanceof Date || isDate({ dateFormat, timeFormat })(value)
              ? value
              : undefined
          }
          isDateAllowed={isDateAllowed}
          label={placeholder}
          locale={locale}
          utc={utc}
          text={text}
        />
      ) : null}
    </FormGroup>
  );
}

export function maskedInput(props: Record<string, unknown>) {
  return <MaskedInput {...props} render={reactStrapInput} />;
}

export function maskedInputGroup(
  props: Record<string, unknown>,
  onClick: () => void
) {
  return (
    <InputGroup>
      <MaskedInput {...props} render={reactStrapInput} />
      <Button onClick={onClick}>
        <Icon icon="calendar_today" />
      </Button>
    </InputGroup>
  );
}

export function reactStrapInput(
  ref: (input: HTMLInputElement) => void,
  props: Record<string, any>
) {
  return <Input innerRef={ref} {...props} />;
}

/**
 * Variant of the DateTimeInput which can be used in a Jarb context.
 */
export const JarbDateTimeInput = withJarb<MomentInput, MomentInput, Props>(
  DateTimeInput,
  (props) => [isDateValidator({ ...props, label: props.jarb.label })]
);

/**
 * Variant of the DateTimeInput which can be used in a final form.
 */
export const FieldDateTimeInput = withField<MomentInput, MomentInput, Props>(
  DateTimeInput,
  (props) => [
    isDateValidator({
      ...props,
      label: typeof props.label === 'string' ? props.label : undefined
    })
  ]
);
