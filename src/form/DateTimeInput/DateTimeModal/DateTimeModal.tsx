import React from 'react';
import Datetime from 'react-datetime';
import moment, { Moment } from 'moment';
import { constant, get } from 'lodash';

import { IsDateAllowed } from '../DateTimeInput';
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
  isDateAllowed?: IsDateAllowed;

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

  return (
    <OpenCloseModal
      isOpen={isOpen}
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
        onChange={x => setValue(x)}
        value={value}
        dateFormat={dateFormat}
        timeFormat={timeFormat}
        locale={locale}
        isValidDate={(date: Moment, current?: Moment) =>
          isDateAllowed(date, current)
        }
      />
    </OpenCloseModal>
  );
}
