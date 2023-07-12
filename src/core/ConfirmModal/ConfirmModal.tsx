import React from 'react';
import { t } from '../../utilities/translation/translation';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';

type Props = {
  /**
   * The text to show in the heading of the modal. Defaults to "Confirmation"
   *
   * @default Confirmation
   */
  label?: string;

  /**
   * The text to show as the cancel button's text, defaults to "Cancel"
   *
   * @default Cancel
   */
  cancelText?: string;

  /**
   * The text to show as the ok button's text, defaults to "OK"
   *
   * @default OK
   */
  confirmText?: string;

  /**
   * Function that gets called when the modal is dismissed or closed via the close button
   *
   */
  onClose: () => void;

  /**
   * Function that gets called when the user clicks the save button
   */
  onSave: () => void;

  /**
   * Text which is rendered inside the modal
   */
  modalText: React.ReactNode;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

/**
 * ConfirmModal offers the user a confirmation dialog before performing an operation.
 * The main use case is a delete action, which we want the user to confirm before proceeding.
 *
 * Note: In most cases, you'll want to use {@link ConfirmButton} instead.
 * That component offers an easy-to-use button that triggers this dialog.
 * However, if it is not possible to trigger the action through a button,
 * such as when using a ButtonDropdown, you can use this component directly instead.
 */
export function ConfirmModal({
  onClose,
  onSave,
  label,
  cancelText,
  confirmText,
  modalText,
  className
}: Props) {
  return (
    <Modal
      onClose={onClose}
      className={className}
      header={t({
        overrideText: label,
        key: 'ConfirmButton.MODAL_HEADER',
        fallback: 'Confirmation'
      })}
      footer={
        <>
          <Button
            className="ms-1"
            color="secondary"
            icon="close"
            onClick={onClose}
          >
            {t({
              overrideText: cancelText,
              key: 'ConfirmButton.CANCEL',
              fallback: 'Cancel'
            })}
          </Button>
          <Button
            className="ms-1"
            color="primary"
            icon="check"
            onClick={onSave}
          >
            {t({
              overrideText: confirmText,
              key: 'ConfirmButton.CONFIRM',
              fallback: 'Confirm'
            })}
          </Button>
        </>
      }
    >
      {modalText}
    </Modal>
  );
}
