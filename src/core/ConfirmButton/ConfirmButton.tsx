import React, { useState } from 'react';

import { Button, Props as ButtonProps } from '../Button/Button';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';

type Text = {
  /**
   * The text to show in the header, defaults to "Confirmation"
   *
   * @default Confirmation
   */
  modalHeader?: string;

  /**
   * The text to show as the cancel button's text, defaults to "Cancel"
   *
   * @default Cancel
   */
  cancel?: string;

  /**
   * The text to show as the ok button's text, defaults to "OK"
   *
   * @default OK
   */
  confirm?: string;
};

type Props = Omit<ButtonProps, 'onClick'> & {
  /**
   * The text you want to render inside the dialog.
   */
  dialogText: React.ReactNode;

  /**
   * Callback which is triggered after the user has 'confirmed' that
   * the action should occur.
   *
   * Basically replaces the logic you would normally put in an `onClick`
   * event in a normal button.
   */
  onConfirm: () => void;

  /**
   * Optionally customized text to use within the component.
   */
  text?: Text;
};

/**
 * The ConfirmButton asks the user if he / she is sure he wants to
 * perform the action.
 *
 * The obvious use case is a delete button which asks the user if
 * he is sure he wants to delete something.
 */
export function ConfirmButton({
  color = 'danger',
  dialogText,
  text = {},
  onConfirm,
  ...buttonProps
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { modalHeader, confirm, cancel } = text;

  function openModal(event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation();
    setIsModalOpen(true);
  }

  function saveModal() {
    setIsModalOpen(false);
    onConfirm();
  }

  return (
    <>
      <Button color={color} onClick={openModal} {...buttonProps} />

      {isModalOpen ? (
        <ConfirmModal
          onClose={() => setIsModalOpen(false)}
          onSave={() => saveModal()}
          label={modalHeader}
          modalText={dialogText}
          cancelText={cancel}
          confirmText={confirm}
        />
      ) : null}
    </>
  );
}
