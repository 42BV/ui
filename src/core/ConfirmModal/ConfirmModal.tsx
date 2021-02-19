import React from 'react';
import { OpenCloseModal, t } from '../..';

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
   * Whether or not the modal is open.
   * @deprecated Please do not use the isOpen boolean to control whether
   * or not the modal is opened. Instead always set isOpen to `true`
   * and only render the ConfirmModal when it should be rendered.
   * In version 4.0.0 the isOpen property will be removed.
   */
  isOpen: boolean;

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
export default function ConfirmModal({
  isOpen,
  onClose,
  onSave,
  label,
  cancelText,
  confirmText,
  modalText
}: Props) {
  return (
    <OpenCloseModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      label={t({
        overrideText: label,
        key: 'ConfirmButton.MODAL_HEADER',
        fallback: 'Confirmation'
      })}
      text={{
        cancel: t({
          overrideText: cancelText,
          key: 'ConfirmButton.CANCEL',
          fallback: 'Cancel'
        }),
        save: t({
          overrideText: confirmText,
          key: 'ConfirmButton.CONFIRM',
          fallback: 'Confirm'
        })
      }}
    >
      {modalText}
    </OpenCloseModal>
  );
}
