import React, { useRef } from 'react';
import { Button } from 'reactstrap';
import Tooltip from '../../../core/Tooltip/Tooltip';
import { useComponentOverflow } from './useComponentOverflow/useComponentOverflow';
import { ButtonAlignment } from '../types';
import classNames from 'classnames';

interface Props {
  /**
   * Function to open the modal, called when the button is clicked.
   */
  openModal: () => void;

  /**
   * The label to display on the button.
   */
  label: React.ReactNode;

  /**
   * The display of selected item(s).
   */
  values?: React.ReactNode;

  /**
   * Optionally the position the button should be aligned to
   * within it's container.
   */
  alignButton?: ButtonAlignment;
}

export function ModalPickerOpener(props: Props) {
  const { openModal, label, values, alignButton } = props;

  const ref = useRef<HTMLElement>(null);

  const isOverflowing = useComponentOverflow(ref, values);

  const wrapperClassName = classNames('d-flex', 'align-items-center', {
    'flex-row-reverse': alignButton === 'left',
    'justify-content-between': alignButton === 'right' && values,
    'justify-content-end':
      alignButton === 'left' || (alignButton === 'right' && !values)
  });

  const truncatorClassName = classNames('text-truncate', 'position-relative', {
    'ml-1': alignButton === 'left',
    'mr-1': alignButton !== 'left'
  });

  return (
    <div className={wrapperClassName}>
      {values ? (
        <span className={truncatorClassName} ref={ref}>
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
      <Button
        color="primary"
        onClick={openModal}
        className="flex-grow-0 flex-shrink-0"
      >
        {label}
      </Button>
    </div>
  );
}
