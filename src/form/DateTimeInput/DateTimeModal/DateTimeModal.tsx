import React, { useState } from 'react';
import ReactDatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import { constant, get } from 'lodash';

import { DateTimeInputIsDateAllowed } from '../DateTimeInput';
import { t } from '../../../utilities/translation/translation';
import { OpenCloseModal } from '../../../core/OpenCloseModal/OpenCloseModal';

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
  onSave: (value?: Date) => void;

  /**
   * The value that the form element currently has.
   */
  defaultValue?: Date;

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

  showDateSelect: boolean;
  showTimeInput: boolean;
  renderCustomHeader: (props: ReactDatePickerCustomHeaderProps) => React.ReactNode;

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
    locale,
    showDateSelect,
    showTimeInput,
    renderCustomHeader,
    text = {
      save: t({
        key: 'DateTimeModal.SELECT',
        fallback: 'Select'
      })
    }
  } = props;
  const isDateAllowed = get(props, 'isDateAllowed', constant(true));

  const [ value, setValue ] = useState(props.defaultValue);

  return (
    <OpenCloseModal
      onClose={onClose}
      onSave={() => onSave(value)}
      label={label}
      text={text}
      size="md"
      className="date-time-modal"
      stickyFooter={false}
    >
      <ReactDatePicker
        onChange={(date) => setValue(
          /* istanbul ignore next */
          date ?? undefined
        )}
        selected={value}
        locale={locale}
        showWeekNumbers={true}
        filterDate={isDateAllowed}
        inline
        showTimeSelectOnly={!showDateSelect}
        showTimeInput={showTimeInput}
        renderCustomHeader={renderCustomHeader}
      />
    </OpenCloseModal>
  );
}
