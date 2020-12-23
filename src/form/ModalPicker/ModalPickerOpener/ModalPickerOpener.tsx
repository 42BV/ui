import React from 'react';
import { Button } from 'reactstrap';
import { ButtonAlignment } from '../types';
import classNames from 'classnames';
import { t } from '../../../utilities/translation/translation';
import TextButton from '../../../core/TextButton/TextButton';
import { RenderValue } from '../single/ModalPickerSingle';
import { RenderValues } from '../multiple/ModalPickerMultiple';

type Text = {
  clear?: string;
};

type BaseProps = {
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
};

type ModalPickerSingleOpenerProps<T> = BaseProps & {
  value?: T;
  renderValue: RenderValue<T>;
};

type ModalPickerMultipleOpenerProps<T> = BaseProps & {
  value?: T[];
  renderValue: RenderValues<T>;
};

type Props<T> =
  | ModalPickerSingleOpenerProps<T>
  | ModalPickerMultipleOpenerProps<T>;

export function ModalPickerOpener<T>(props: Props<T>) {
  const {
    openModal,
    label,
    alignButton,
    onClear,
    text = {},
    renderValue,
    value
  } = props;

  const hasValue = !!value;

  const wrapperClassName = classNames('d-flex', 'align-items-center', {
    'flex-row-reverse': alignButton === 'left',
    'justify-content-between': alignButton === 'right' && hasValue,
    'justify-content-end':
      alignButton === 'left' || (alignButton === 'right' && !hasValue)
  });

  const buttonClassName = classNames('flex-grow-0', 'flex-shrink-0', {
    'mr-1': hasValue && alignButton === 'left',
    'ml-1': hasValue && alignButton !== 'left'
  });

  // @ts-expect-error Accept that DisplayValues is sometimes an array and sometimes not
  const displayValue = renderValue(value);

  return (
    <div className={wrapperClassName}>
      {displayValue}

      {hasValue && onClear ? (
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
