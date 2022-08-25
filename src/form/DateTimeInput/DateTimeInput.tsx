import React, { ForwardedRef, forwardRef, useState } from 'react';
import { FormGroup, Input, InputGroup, Label } from 'reactstrap';
import ReactDatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import { constant, get, isNaN, range, uniqueId } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';

import { withJarb } from '../withJarb/withJarb';
import { FieldCompatible } from '../types';
import { AddonButton } from '../addons/AddonButton/AddonButton';
import { Icon } from '../../core/Icon';
import { Select } from '../Select/Select';
import { t } from '../../utilities/translation/translation';
import { DateFormat, TimeFormat } from './types';
import { isDateValidator } from './validators';
import { isDate } from './checkers';
import { combineFormat } from './utils';
import { DateTimeModal, Text } from './DateTimeModal/DateTimeModal';
import { withField } from '../withField/withField';

/**
 * Callback which returns whether a date is selectable.
 */
export type DateTimeInputIsDateAllowed = (
  date: Date,
  selectedDate?: Date
) => boolean;

export type DateTimeInputMode = 'modal' | 'inline' | 'default';

export type Props = FieldCompatible<Date | string | undefined, Date | string | undefined> & {
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
  const [ isModalOpen, setIsModalOpen ] = useState(false);

  const {
    id = uniqueId(),
    label,
    hiddenLabel,
    placeholder,
    valid,
    onFocus,
    onBlur,
    onChange,
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

  const formGroupClassName = classNames('date-time-input', className, {
    'with-modal': mode === 'modal'
  });

  function ReactStrapInputGroup(
    props: Record<string, any>,
    ref: ForwardedRef<any>
  ) {
    return (
      <InputGroup>
        <Input innerRef={ref} {...props} />
        <AddonButton onClick={() => setIsModalOpen(!isModalOpen)}>
          <Icon icon="edit_calendar" />
        </AddonButton>
      </InputGroup>
    );
  }

  const ReactStrapInputGroupRef = forwardRef(ReactStrapInputGroup);

  return (
    <FormGroup className={formGroupClassName} color={color}>
      <Label for={id} className={classNames({'visually-hidden': hiddenLabel})}>{label}</Label>
      {mode === 'modal' ? (
        <>
          <ReactDatePicker
            onChangeRaw={(event) => onChange(event.target.value)}
            onChange={(date) => onChange(
              /* istanbul ignore next */
              date ?? undefined
            )}
            onBlur={onBlur}
            selected={dateFromValue({value, dateFormat, timeFormat})}
            placeholderText={placeholder}
            dateFormat={combineFormat(dateFormat, timeFormat)}
            locale={locale}
            showTimeSelect={false}
            showTimeSelectOnly={true}
            showPopperArrow={false}
            filterDate={isDateAllowed}
            className={classNames('form-control', { 'is-invalid': valid === false })}
            customInput={<ReactStrapInputGroupRef />}
            onFocus={onFocus}
          />
          {isModalOpen ? (
            <DateTimeModal
              onClose={() => setIsModalOpen(false)}
              onSave={(date) => {
                onChange(date);
                setIsModalOpen(false);
              }}
              defaultValue={dateFromValue({value, dateFormat, timeFormat})}
              isDateAllowed={isDateAllowed}
              label={placeholder}
              locale={locale}
              text={text}
              showDateSelect={!!dateFormat}
              showTimeInput={!!timeFormat}
              renderCustomHeader={dateTimeInputHeader}
            />
          ) : null}
        </>
      ) : (
        <ReactDatePicker
          id={id}
          onChangeRaw={(event) => onChange(event.target.value)}
          onChange={(date) => onChange(
            /* istanbul ignore next */
            date ?? undefined
          )}
          onBlur={onBlur}
          selected={dateFromValue({value, dateFormat, timeFormat})}
          placeholderText={placeholder}
          dateFormat={combineFormat(dateFormat, timeFormat)}
          locale={locale}
          showWeekNumbers={true}
          showMonthDropdown={true}
          showYearDropdown={true}
          showTimeSelectOnly={!dateFormat}
          showTimeInput={!!timeFormat}
          showPopperArrow={false}
          popperModifiers={[
            {
              name: "offset",
              options: {
                offset: [0, -10],
              }
            }
          ]}
          filterDate={isDateAllowed}
          inline={mode === 'inline'}
          className={classNames('form-control', { 'is-invalid': valid === false })}
          customInput={<ReactStrapInputRef />}
          renderCustomHeader={dateTimeInputHeader}
          onFocus={onFocus}
        />
      )}
      {error}
    </FormGroup>
  );
}

function dateFromValue({ value, dateFormat, timeFormat }: { value?: Date | string; dateFormat: DateFormat; timeFormat: TimeFormat }) {
  if (value instanceof Date) {
    return value;
  }

  return value && isDate({ dateFormat, timeFormat })(value) ? new Date(value) : undefined;
}

const ReactStrapInputRef = forwardRef(ReactStrapInput);

function ReactStrapInput(
  props: Record<string, any>,
  ref: ForwardedRef<any>
) {
  return <Input innerRef={ref} {...props} />;
}

type MonthOption = {
  value: number;
  label: string;
};

function dateTimeInputHeader({
  date,
  increaseYear,
  decreaseYear,
  changeYear,
  changeMonth
}: ReactDatePickerCustomHeaderProps) {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <Icon icon="chevron_left" onClick={decreaseYear} className="mb-3" />
      <div className="d-flex flex-nowrap align-items-center">
        <Select<MonthOption>
          id="month"
          label={t({
            key: 'DateTimeInput.MONTH',
            fallback: 'Month'
          })}
          hiddenLabel={true}
          value={{value: date.getMonth(), label: moment(date).format('MMMM')}}
          onChange={(month) => changeMonth(month.value)}
          options={range(0, 11).map((month) => ({value: month, label: moment(`2022-${month < 9 ? '0' : ''}${month + 1}-01`).format('MMMM')}))}
          labelForOption={(month) => month.label}
          className="me-1"
        />
        <FormGroup>
          <Input
            type="number"
            value={date.getFullYear()}
            onChange={(event) => {
              if (event.target.value && !isNaN(event.target.value)) {
                changeYear(parseInt(event.target.value));
              }
            }}
            aria-label={t({
              key: 'DateTimeInput.YEAR',
              fallback: 'Year'
            })}
            style={{ width: 90 }}
          />
        </FormGroup>
      </div>
      <Icon icon="chevron_right" onClick={increaseYear} className="mb-3" />
    </div>
  );
}

/**
 * Variant of the DateTimeInput which can be used in a Jarb context.
 */
export const JarbDateTimeInput = withJarb<Date | string, Date | string, Props>(
  DateTimeInput,
  (props) => [ isDateValidator({ ...props, label: props.jarb.label }) ]
);

/**
 * Variant of the DateTimeInput which can be used in a final form.
 */
export const FieldDateTimeInput = withField<Date | string, Date | string, Props>(
  DateTimeInput,
  (props) => [ isDateValidator({ ...props, label: typeof props.label === 'string' ? props.label : undefined }) ]
);
