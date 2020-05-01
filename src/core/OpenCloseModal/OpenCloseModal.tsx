import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Button from '../Button/Button';
import { t } from '../../utilities/translation/translation';
import { BootstrapSize } from '../types';

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
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
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
    className
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => onClose()}
      size={size}
      className={className}
    >
      {label ? (
        <ModalHeader toggle={() => onClose()}>{label}</ModalHeader>
      ) : null}
      <ModalBody>{children}</ModalBody>
      {onSave ? (
        <ModalFooter>
          <Button className="ml-1" color="secondary" onClick={() => onClose()}>
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
