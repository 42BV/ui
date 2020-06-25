import React from 'react';
import { Button } from 'reactstrap';
import { ButtonAlignment } from '../types';
import classNames from 'classnames';
import { t } from '../../../utilities/translation/translation';
import TextButton from '../../../core/TextButton/TextButton';
import { DisplayValue } from '../single/ModalPickerSingle';
import { DisplayValues } from '../multiple/ModalPickerMultiple';

interface Text {
  clear?: string;
}

interface BaseProps<T> {
  /**
   * Function to open the modal, called when the button is clicked.
   */
  openModal: () => void;

  /**
   * The label to display on the button.
   */
  label: React.ReactNode;

  /**
   * Optionally: what needs to happen when the clear button is pressed
   */
  onClear?: () => void;

  /**
   * Optionally the position the button should be aligned to
   * within it's container.
   */
  alignButton?: ButtonAlignment;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;
}

interface ModalPickerSingleOpenerProps<T> extends BaseProps<T> {
  values?: T;
  displayValues: DisplayValue<T>;
}

interface ModalPickerMultipleOpenerProps<T> extends BaseProps<T> {
  values?: T[];
  displayValues: DisplayValues<T>;
}

type Props<T> =
  | ModalPickerSingleOpenerProps<T>
  | ModalPickerMultipleOpenerProps<T>;

export function ModalPickerOpener<T>(props: Props<T>) {
  const {
    openModal,
    label,
    values,
    displayValues,
    alignButton,
    onClear,
    text = {}
  } = props;

  const wrapperClassName = classNames('d-flex', 'align-items-center', {
    'flex-row-reverse': alignButton === 'left',
    'justify-content-between': alignButton === 'right' && values,
    'justify-content-end':
      alignButton === 'left' || (alignButton === 'right' && !values)
  });

  const buttonClassName = classNames('flex-grow-0', 'flex-shrink-0', {
    'mr-1': values && alignButton === 'left',
    'ml-1': values && alignButton !== 'left'
  });

  // @ts-ignore
  const displayValue = displayValues(values);

  return (
    <div className={wrapperClassName}>
      {displayValue}

      {values && onClear ? (
        <TextButton onClick={onClear} className="mx-3">
          {t({
            overrideText: text.clear,
            key: 'ModalPickerOpener.CLEAR',
            fallback: 'Clear'
          })}
        </TextButton>
      ) : null}

      <Button color="primary" onClick={openModal} className={buttonClassName}>
        {label}
      </Button>
    </div>
  );
}
