import React from 'react';
import { FormGroup, Input, InputGroup, Label } from 'reactstrap';
import Datetime from 'react-datetime';
import { constant, get, isEmpty } from 'lodash';
import moment, { Moment } from 'moment';
import MaskedInput from 'react-text-mask';
import { Icon } from '../..';

import { DateFormat, TimeFormat } from './types';

import { combineFormat, formatToMask, isDate } from './utils';

import withJarb, { WithJarbProps } from '../withJarb/withJarb';
import { doBlur } from '../utils';
import { DateTimeModal, Text } from './DateTimeModal/DateTimeModal';
import classNames from 'classnames';
import { useHasFormatError } from './hooks/useHasFormatError';
import { useIsModalOpen } from './hooks/useIsModalOpen';
import { AddonButton } from '../addons/AddonButton/AddonButton';
import { useSetLastStringValue } from './hooks/useSetLastStringValue';
import { FieldCompatible } from '../types';
import { isDateValidator } from './validators';

/**
 * Callback which returns whether a date is selectable.
 */
export type DateTimeInputIsDateAllowed = (
  date: Moment,
  selectedDate?: Moment
) => boolean;

export type DateTimeInputMode = 'modal' | 'default';

export type Props = FieldCompatible<Date, Date | undefined> & {
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
  isDateAllowed?: DateTimeInputIsDateAllowed;

  /**
   * Optionally the locale moment js should use.
   */
  locale?: string;

  /**
   * When true, input time values will be interpreted as UTC (Zulu time)
   * by Moment.js. Otherwise they will default to the user's local
   * timezone.
   *
   * Defaults to true.
   */
  utc?: boolean;

  /**
   * Whether or not the date picker should be displayed in a modal.
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
export default function DateTimeInput(props: Props) {
  /*
    When the user enter an invalid string. We call `onChange(null)` 
    to indicate that the value is no longer a valid date. This will
    however cause the input to become empty, if the developer sends
    the `value` right back to us.

    That is why we track the last known string value and use that as 
    the value when the value is not a date. This way the user's input
    is not lost when he enters an invalid date.
  */
  const [lastStringValue, setLastStringValue] = useSetLastStringValue();

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

  // Is either a valid MomentJS object when selected via picker,
  // or a string when the user typed in a value manually.
  function onChange(value: string | Moment) {
    const { onChange, onBlur } = props;

    if (typeof value === 'string') {
      if (isDate(value, dateFormat, timeFormat)) {
        setLastStringValue(value);

        const date = moment(
          value.trim(), // value includes an empty char at the back for some reason.
          combineFormat(dateFormat, timeFormat)
        );
        onChange(date.toDate());
        setHasFormatError(false);
      } else {
        setLastStringValue(value);

        onChange(undefined);

        setHasFormatError(!isEmpty(value));
      }
    } else {
      const valueAsString = moment(value.toDate()).format(
        combineFormat(dateFormat, timeFormat)
      );
      setLastStringValue(valueAsString);

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
          // @ts-expect-error Our input prop will have a mask because it is a `MaskedInput`.
          mask: formatToMask(dateFormat, timeFormat),
          placeholder,
          invalid: valid === false || hasFormatError,
          id
        }}
        open={mode === 'modal' ? false : undefined}
        renderInput={(props) =>
          mode === 'modal'
            ? maskedInputGroup(props, () => setIsModalOpen(true))
            : maskedInput(props)
        }
        onChange={onChange}
        onOpen={onFocus}
        value={value ? value : lastStringValue}
        dateFormat={dateFormat}
        timeFormat={timeFormat}
        closeOnSelect={true}
        locale={locale}
        utc={utc}
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
          utc={utc}
          text={text}
        />
      ) : null}
    </FormGroup>
  );
}

/**
 * Variant of the DateTimeInput which can be used in a Jarb context.
 */
export const JarbDateTimeInput = withJarb<Date, Date | undefined, Props>(
  DateTimeInput,
  {
    defaultValidators: ({
      dateFormat,
      timeFormat,
      jarb: { label }
    }: WithJarbProps<Date | undefined, Props>) => {
      return [isDateValidator({ dateFormat, timeFormat, label })];
    }
  }
);

export function maskedInput(props: unknown) {
  return <MaskedInput {...props} render={reactStrapInput} />;
}

export function maskedInputGroup(props: unknown, onClick: () => void) {
  return (
    <InputGroup>
      <MaskedInput {...props} render={reactStrapInput} />
      <AddonButton onClick={onClick}>
        <Icon icon="calendar_today" />
      </AddonButton>
    </InputGroup>
  );
}

export function reactStrapInput(
  ref: (input: HTMLInputElement) => void,
  props: Record<string, any>
) {
  return <Input innerRef={ref} {...props} />;
}
