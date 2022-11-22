import React, { useState } from 'react';

import { Button } from '../Button/Button';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import { ButtonProps, WithHeader } from '../types';

type Text = {
  /**
   * The text to show as the cancel button's text, defaults to "Cancel"
   *
   * @default Cancel
   */
  cancel?: string;

  /**
   * The text to show as the OK button's text, defaults to "OK"
   *
   * @default OK
   */
  confirm?: string;
} & Partial<WithHeader<string>>;

type ConfirmButtonProps = {
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
} & ButtonProps<React.ReactNode>;

/**
 * The ConfirmButton asks the user whether they are certain they want to
 * perform the action.
 *
 * The obvious use case is a delete button which asks the user whether they are
 * sure they want to delete something.
 */
export function ConfirmButton({
  dialogText,
  onConfirm,
  text = {},
  className,
  color = 'danger',
  icon,
  children,
  ...buttonProps
}: ConfirmButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { header, confirm, cancel } = text;

  function closeModal() {
    setIsModalOpen(false);
  }

  function saveModal() {
    setIsModalOpen(false);
    onConfirm();
  }

  function openModal(event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation();
    setIsModalOpen(true);
  }

  return (
    <div
      className={className}
      style={{
        display: icon && !children ? 'inline' : 'block'
      }}
    >
      <Button color={color} icon={icon} {...buttonProps} onClick={openModal}>
        {children}
      </Button>

      {isModalOpen ? (
        <ConfirmModal
          onClose={closeModal}
          onSave={saveModal}
          label={header}
          cancelText={cancel}
          confirmText={confirm}
        >
          {dialogText}
        </ConfirmModal>
      ) : null}
    </div>
  );
}
