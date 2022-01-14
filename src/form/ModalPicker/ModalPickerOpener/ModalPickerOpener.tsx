import React from 'react';
import { Button } from 'reactstrap';
import { ModalPickerButtonAlignment } from '../types';
import classNames from 'classnames';
import { t } from '../../../utilities/translation/translation';
import TextButton from '../../../core/TextButton/TextButton';
import { ModalPickerSingleRenderValue } from '../single/ModalPickerSingle';
import { ModalPickerMultipleRenderValues } from '../multiple/ModalPickerMultiple';
import { Icon, IconType } from '../../../core/Icon';

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
   * Optionally the icon to display on the button.
   */
  icon?: IconType;

  /**
   * Optionally: what needs to happen when the clear button is pressed
   */
  onClear?: () => void;

  /**
   * Optionally the position the button should be aligned to
   * within it's container.
   */
  alignButton?: ModalPickerButtonAlignment;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;
};

type ModalPickerSingleOpenerProps<T> = BaseProps & {
  value?: T;
  renderValue: ModalPickerSingleRenderValue<T>;
};

type ModalPickerMultipleOpenerProps<T> = BaseProps & {
  value?: T[];
  renderValue: ModalPickerMultipleRenderValues<T>;
};

type Props<T> =
  | ModalPickerSingleOpenerProps<T>
  | ModalPickerMultipleOpenerProps<T>;

export function ModalPickerOpener<T>(props: Props<T>) {
  const {
    openModal,
    label,
    icon,
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
    'me-3': hasValue && alignButton === 'left',
    'ms-3': hasValue && alignButton !== 'left'
  });

  // @ts-expect-error Accept that DisplayValues is sometimes an array and sometimes not
  const displayValue = renderValue(value);

  return (
    <div className={wrapperClassName}>
      {displayValue}

      {hasValue && onClear ? (
        <TextButton onClick={onClear} className="ms-3">
          {t({
            overrideText: text.clear,
            key: 'ModalPickerOpener.CLEAR',
            fallback: 'Clear'
          })}
        </TextButton>
      ) : null}

      <Button color="primary" onClick={openModal} className={buttonClassName}>
        {icon ? <Icon icon={icon} className="me-2 align-bottom" /> : null}
        {label}
      </Button>
    </div>
  );
}
