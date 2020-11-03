import React, { useState } from 'react';

import Button, {
  BaseProps as ButtonBaseProps,
  isWithIcon,
  isWithIconAndText,
  isWithText,
  Props as ButtonProps,
  ButtonSize
} from '../Button/Button';
import { Color } from '../types';
import IconType from '../Icon/types';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

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
  onConfirm: () => void;

  /**
   * Whether or not the action you are performing is currently in
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
   * Optionally the size of the icon in pixels.
   */
  iconSize?: number;

  /**
   * Optionally the text of the button.
   */
  children: React.ReactNode;

  /**
   * Optionally the size of the button.
   *
   * Defaults to 'md'.
   */
  size?: ButtonSize;

  /**
   * Optionally whether or not the button should take the full width
   * available.
   *
   * Defauts to `false`
   */
  fullWidth?: boolean;
}

interface WithIcon extends BaseProps {
  /**
   * The Icon you want to use.
   */
  icon: IconType;

  /**
   * Optionally the size of the icon in pixels.
   */
  iconSize?: number;

  children?: never;
  size?: never;
  fullWidth?: never;
}

interface WithText extends BaseProps {
  /**
   * Optionally the text of the button.
   */
  children: React.ReactNode;

  /**
   * Optionally the size of the button.
   *
   * Defaults to 'md'.
   */
  size?: ButtonSize;

  /**
   * Optionally whether or not the button should take the full width
   * available.
   *
   * Defauts to `false`
   */
  fullWidth?: boolean;

  icon?: never;
  iconSize?: never;
}

type Props = WithIcon | WithText | WithIconAndText;

/**
 * The ConfirmButton asks the user if he / she is sure he wants to
 * perform the action.
 *
 * The obvious use case is a delete button which asks the user if
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
  const [isOpen, setOpen] = useState(false);
  const { modalHeader, confirm, cancel } = text;

  function openModal(event: React.MouseEvent<HTMLElement>) {
    event.stopPropagation();
    setOpen(true);
  }

  function saveModal() {
    setOpen(false);
    onConfirm();
  }

  function getProps() {
    const buttonProps: ButtonBaseProps = {
      onClick: openModal,
      color,
      inProgress: !!inProgress
    };

    if (isWithIcon(props) || isWithIconAndText(props)) {
      const withIcon = buttonProps as WithIcon | WithIconAndText;

      withIcon.icon = props.icon;
      withIcon.iconSize = props.iconSize;
    }

    if (isWithText(props) || isWithIconAndText(props)) {
      const withText = buttonProps as WithText | WithIconAndText;

      withText.children = props.children;
      withText.fullWidth = props.fullWidth;
      withText.size = props.size;
    }

    return buttonProps as ButtonProps;
  }

  return (
    <div
      className={className}
      style={{ display: 'children' in props ? 'block' : 'inline' }}
    >
      <Button {...getProps()} />

      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        onSave={() => saveModal()}
        label={modalHeader}
        modalText={dialogText}
        cancelText={cancel}
        confirmText={confirm}
      />
    </div>
  );
}
