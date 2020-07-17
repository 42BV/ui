import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Button from '../Button/Button';
import { t } from '../../utilities/translation/translation';
import { BootstrapSize } from '../types';
import { useBodyFixOnModalClose } from '../useBodyFixOnModalClose/useBodyFixOnModalClose';
import { IconType } from '../Icon';

type Text = {
  cancel?: string;
  save?: string;
};

type Props = {
  /**
   * Whether or not the modal is open.
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
   * Optional extra CSS class you want to add to the <ModalBody>.
   * Useful for styling the component.
   */
  modalBodyClassName?: string;
};

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
    modalBodyClassName
  } = props;

  useBodyFixOnModalClose(isOpen);

  return (
    <Modal
      wrapClassName={`open-close-modal ${
        stickyFooter ? 'open-close-modal--sticky' : ''
      }`}
      isOpen={isOpen}
      toggle={() => onClose()}
      size={size}
      className={className}
    >
      {label ? (
        <ModalHeader toggle={() => onClose()}>{label}</ModalHeader>
      ) : null}
      <ModalBody className={modalBodyClassName}>{children}</ModalBody>
      {onSave ? (
        <ModalFooter>
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
          <Button
            className="ml-1"
            color="primary"
            inProgress={inProgress}
            icon={saveIcon}
            onClick={() => onSave()}
          >
            {t({
              overrideText: text?.save,
              key: 'OpenCloseModal.SAVE',
              fallback: 'Save'
            })}
          </Button>
        </ModalFooter>
      ) : null}
    </Modal>
  );
}
