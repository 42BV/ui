import React, { useRef } from 'react';
import { Button } from 'reactstrap';
import Tooltip from '../../../core/Tooltip/Tooltip';
import { useComponentOverflow } from './useComponentOverflow/useComponentOverflow';

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
}

export function ModalPickerOpener(props: Props) {
  const { openModal, label, values } = props;

  const ref = useRef<HTMLElement>(null);

  const isOverflowing = useComponentOverflow(ref, values);

  return (
    <div className="d-flex align-items-center">
      {values ? (
        <span className="text-truncate mr-1 position-relative" ref={ref}>
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
