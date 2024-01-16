import React, { useState } from 'react';
import Datetime from 'react-datetime';
import moment, { Moment, MomentInput } from 'moment';
import { constant, get } from 'lodash';

import { DateTimeInputIsDateAllowed } from '../DateTimeInput';
import { DateFormat, TimeFormat } from '../types';
import { t } from '../../../utilities/translation/translation';
import { Modal, ModalFooter, ModalHeader } from 'reactstrap';
import { Button } from '../../../core/Button/Button';

export type Text = {
  cancel?: string;
  select?: string;
};

type Props = {
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
  defaultValue?: MomentInput;

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
   * Is ran for every date which is displayed. By default, every
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
    onClose,
    onSave,
    label,
    dateFormat,
    timeFormat,
    locale,
    utc = true,
    text
  } = props;
  const isDateAllowed = get(props, 'isDateAllowed', constant(true));

  const [value, setValue] = useState(
    props.defaultValue ? moment(props.defaultValue) : ''
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      className="date-time-modal"
      size="sm"
    >
      <ModalHeader toggle={onClose}>{label}</ModalHeader>
      <Datetime
        input={false}
        open={true}
        closeOnSelect={false}
        onChange={setValue}
        value={value}
        dateFormat={dateFormat}
        timeFormat={timeFormat}
        locale={locale}
        utc={utc}
        isValidDate={(date: Moment, current?: Moment) =>
          isDateAllowed(date, current)
        }
      />
      <ModalFooter>
        <Button
          className="ms-1"
          color="secondary"
          icon="cancel"
          onClick={onClose}
        >
          {t({
            overrideText: text?.cancel,
            key: 'OpenCloseModal.CANCEL',
            fallback: 'Cancel'
          })}
        </Button>
        <Button
          className="ms-1"
          color="primary"
          icon="save"
          onClick={() => onSave(value)}
        >
          {t({
            overrideText: text?.select,
            key: 'DateTimeModal.SELECT',
            fallback: 'Select'
          })}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
