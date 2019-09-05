import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Button from '../Button/Button';
import { Color } from '../types';
import IconType from '../Icon/types';
import { t } from '../../utilities/translation/translation';

interface Text {
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
}

interface BaseProps {
  /**
   * The text you want to render inside of the dialog.
   */
  dialogText: React.ReactNode;

  /**
   * Optionally the color of the button
   *
   * @default danger
   */
  color?: Color;

  /**
   * Callback which is triggered after the user has 'confirmed' that
   * the action should occur.
   *
   * Basically replaces the logic you would normally put in an `onClick`
   * event in a normal button.
   */
  onConfirm: (event: React.MouseEvent<HTMLElement>) => void;

  /**
   * Whether or not the action you are performing is currenlty in
   * progress. If so a spinner is rendered inside of the button.
   * This behavior is optional and default to `false`.
   *
   * @default false
   */
  inProgress?: boolean;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optionally customized text to use within the component.
   */
  text?: Text;
}

interface WithIconAndText extends BaseProps {
  /**
   * Optionally the Icon you want to use.
   */
  icon: IconType;

  /**
   * Optionally the text of the button.
   */
  children: React.ReactNode;
}

interface WithIcon extends BaseProps {
  /**
   * The Icon you want to use.
   */
  icon: IconType;
}

interface WithText extends BaseProps {
  /**
   * Optionally the text of the button.
   */
  children: React.ReactNode;
}

type Props = WithIcon | WithText | WithIconAndText;

/**
 * The ConfirmButton asks the user if he / she is sure he wants to
 * perform the action.
 *
 * The obvious usecase is a delete button which asks the user if
 * he is sure he wants to delete something.
 */
export default function ConfirmButton({
  dialogText,
  color = 'danger',
  onConfirm,
  inProgress,
  text = {},
  className,
  ...props
}: Props) {
  const children = 'children' in props ? props.children : undefined;
  const icon = 'icon' in props ? props.icon : undefined;
  const [isOpen, setOpen] = useState(false);
  const { modalHeader, confirm, cancel } = text;

  function openModal(event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation();
    setOpen(true);
  }

  function saveModal(event: React.MouseEvent<HTMLElement>) {
    setOpen(false);
    onConfirm(event);
  }

  return (
    <div
      className={className}
      style={{ display: icon && !children ? 'inline' : 'block' }}
    >
      <Button
        onClick={openModal}
        icon={icon}
        color={color}
        inProgress={!!inProgress}
      >
        {children}
      </Button>

      <Modal isOpen={isOpen} toggle={() => setOpen(false)}>
        <ModalHeader toggle={() => setOpen(false)}>
          {t({
            overrideText: modalHeader,
            key: 'ConfirmButton.MODAL_HEADER',
            fallback: 'Confirmation'
          })}
        </ModalHeader>
        <ModalBody>{dialogText}</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setOpen(false)}>
            {t({
              overrideText: cancel,
              key: 'ConfirmButton.CANCEL',
              fallback: 'Cancel'
            })}
          </Button>
          <Button color="primary" onClick={e => saveModal(e)}>
            {t({
              overrideText: confirm,
              key: 'ConfirmButton.CONFIRM',
              fallback: 'Confirm'
            })}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
