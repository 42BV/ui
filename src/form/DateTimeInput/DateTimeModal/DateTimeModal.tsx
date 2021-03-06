import React from 'react';
import Datetime from 'react-datetime';
import moment, { Moment } from 'moment';
import { constant, get } from 'lodash';

import { DateTimeInputIsDateAllowed } from '../DateTimeInput';
import { DateFormat, TimeFormat } from '../types';
import { t } from '../../../utilities/translation/translation';
import { useValue } from './useValue';
import { OpenCloseModal } from '../../../core/OpenCloseModal/OpenCloseModal';

export type Text = {
  cancel?: string;
  select?: string;
};

type Props = {
  /**
   * Whether or not the modal is open.
   * @deprecated Please do not use the isOpen boolean to control whether
   * or not the modal is opened. Instead always set isOpen to `true`
   * and only render the OpenCloseModal when it should be rendered.
   * In version 4.0.0 the isOpen property will be removed.
   */
  isOpen: boolean;

  /**
   * Callback for when the modal should close.
   */
  onClose: () => void;

  /**
   * The label of the form element.
   */
  label?: React.ReactNode;

  /**
   * Callback for when the form element changes.
   */
  onSave: (value: Moment | string) => void;

  /**
   * The value that the form element currently has.
   */
  defaultValue?: Date;

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
   * Optionally the locale moment js should use.
   */
  locale?: string;

  /**
   * Optional Callback which returns whether a date is selectable.
   * Is ran for every date which is displayed. By default every
   * date can be selected.
   */
  isDateAllowed?: DateTimeInputIsDateAllowed;

  /**
   * When true, input time values will be interpreted as UTC (Zulu time)
   * by Moment.js. Otherwise they will default to the user's local
   * timezone.
   *
   * Defaults to true.
   */
  utc?: boolean;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;
};

export function DateTimeModal(props: Props) {
  const {
    isOpen,
    onClose,
    onSave,
    label,
    dateFormat,
    timeFormat,
    locale,
    utc = true,
    text = {
      save: t({
        key: 'DateTimeModal.SELECT',
        fallback: 'Select'
      })
    }
  } = props;
  const isDateAllowed = get(props, 'isDateAllowed', constant(true));

  const [value, setValue] = useValue(
    props.defaultValue ? moment(props.defaultValue) : ''
  );

  if (!isOpen) {
    return null;
  }

  return (
    <OpenCloseModal
      isOpen={true}
      onClose={onClose}
      onSave={() => onSave(value)}
      label={label}
      text={text}
      size="sm"
      className="date-time-modal"
      stickyFooter={false}
    >
      <Datetime
        input={false}
        open={true}
        closeOnSelect={false}
        onChange={(x) => setValue(x)}
        value={value}
        dateFormat={dateFormat}
        timeFormat={timeFormat}
        locale={locale}
        utc={utc}
        isValidDate={(date: Moment, current?: Moment) =>
          isDateAllowed(date, current)
        }
      />
    </OpenCloseModal>
  );
}
