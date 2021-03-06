import React from 'react';
import Button from '../Button/Button';
import SubmitButton from '../SubmitButton/SubmitButton';
import { t } from '../../utilities/translation/translation';
import { BootstrapSize } from '../types';
import { IconType } from '../Icon';
import { Modal } from '../Modal/Modal';

type Text = {
  cancel?: string;
  save?: string;
};

type Props = {
  /**
   * Whether or not the modal is open.
   * @deprecated Please do not use the isOpen boolean to control whether
   * or not the modal is opened. Instead always set isOpen to `true`
   * and only render the OpenCloseModal when it should be rendered.
   * In version 4.0.0 the isOpen property will be removed.
   */
  isOpen: boolean;

  /**
   * Whether or not the save action you are performing is currently in
   * progress. If so a spinner is rendered inside of the button.
   * This behavior is optional and default to `false`.
   */
  inProgress?: boolean;

  /**
   * Callback for when the modal should close.
   */
  onClose: () => void;

  /**
   * Optionally the icon of the save button.
   *
   * Defaults to `save`
   */
  saveIcon?: IconType;

  /**
   * Optionally icon of the cancel button.
   *
   * Defaults to `cancel`
   */
  cancelIcon?: IconType;

  /**
   * Callback for when the save button is clicked.
   */
  onSave?: () => void;

  /**
   * The content of the modal body.
   */
  children: React.ReactNode;

  /**
   * The label of the form element.
   */
  label?: React.ReactNode;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;

  /**
   * Optionally the size (width) of the modal.
   */
  size?: BootstrapSize;

  /**
   * Whether the footer should stick to the bottom of the modal.
   * This allows the user to always click the close and save buttons.
   *
   * Defaults to `true`.
   */
  stickyFooter?: boolean;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optional extra CSS class you want to add to the <ModalHeader>.
   * Useful for styling the component.
   */
  modalHeaderClassName?: string;

  /**
   * Optional extra CSS class you want to add to the <ModalBody>.
   * Useful for styling the component.
   */
  modalBodyClassName?: string;

  /**
   * Optional extra CSS class you want to add to the <ModalFooter>.
   * Useful for styling the component.
   */
  modalFooterClassName?: string;
};

/**
 * Often a modal is content with a header and a cancel and save button
 * in the footer. To make it easier for you developers, we included the
 * OpenCloseModal which already includes the cancel and save button to
 * save you some code duplication for all those similar modals. If you
 * want a more advanced display, you should use the `<Modal>` component.
 */
export function OpenCloseModal(props: Props) {
  const {
    isOpen,
    inProgress,
    onClose,
    onSave,
    children,
    label,
    text,
    size,
    className,
    saveIcon = 'save',
    cancelIcon = 'cancel',
    stickyFooter = true,
    modalHeaderClassName,
    modalBodyClassName,
    modalFooterClassName
  } = props;

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      stickyFooter={stickyFooter}
      onClose={onClose}
      size={size}
      className={className}
      modalHeaderClassName={modalHeaderClassName}
      modalBodyClassName={modalBodyClassName}
      modalFooterClassName={modalFooterClassName}
      header={label}
      footer={
        onSave ? (
          <>
            <Button
              className="ml-1"
              color="secondary"
              icon={cancelIcon}
              onClick={() => onClose()}
            >
              {t({
                overrideText: text?.cancel,
                key: 'OpenCloseModal.CANCEL',
                fallback: 'Cancel'
              })}
            </Button>
            <SubmitButton
              className="ml-1"
              inProgress={!!inProgress}
              icon={saveIcon}
              onClick={() => onSave()}
            >
              {t({
                overrideText: text?.save,
                key: 'OpenCloseModal.SAVE',
                fallback: 'Save'
              })}
            </SubmitButton>
          </>
        ) : undefined
      }
    >
      {children}
    </Modal>
  );
}
