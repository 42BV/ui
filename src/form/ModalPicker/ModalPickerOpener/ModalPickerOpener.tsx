import React, { useRef } from 'react';
import { Button } from 'reactstrap';
import Tooltip from '../../../core/Tooltip/Tooltip';
import { useComponentOverflow } from './useComponentOverflow/useComponentOverflow';
import { ButtonAlignment } from '../types';
import classNames from 'classnames';
import { t } from '../../../utilities/translation/translation';
import TextButton from '../../../core/TextButton/TextButton';

export type DisplayValues<T> = (
  values?: T | T[] | React.ReactNode
) => React.ReactNode;

interface Text {
  clear?: string;
}

interface Props<T> {
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
   * The selected item(s).
   */
  values?: T | T[] | React.ReactNode;

  /**
   * Optionally callback to display the selected item(s).
   * @param values
   */
  displayValues?: DisplayValues<T>;

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

  const ref = useRef<HTMLElement>(null);

  const isOverflowing = useComponentOverflow(ref, values);

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

  return (
    <div className={wrapperClassName}>
      {displayValues ? (
        displayValues(values)
      ) : values ? (
        <span className="text-truncate position-relative" ref={ref}>
          {isOverflowing ? (
            <Tooltip
              content={values}
              className="w-100 h-100 position-absolute"
              tag="div"
            >
              {' '}
            </Tooltip>
          ) : null}
          {values}
        </span>
      ) : null}

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
