import React from 'react';

import Button, { ButtonSize } from '../Button/Button';

export type Props = {
  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optionally the size of the button
   *
   * Defaults to 'md'.
   */
  size?: ButtonSize;

  /**
   * Optional callback for what needs to happen when the button is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => any;

  /**
   * The text of the button.
   */
  children?: React.ReactNode;

  /**
   * Whether or not the action you are performing is currently in
   * progress. If so a spinner is rendered inside of the button.
   */
  inProgress: boolean;

  /**
   * Optionally the size of the icon in pixels.
   */
  iconSize?: number;
};

/**
 * A SubmitButton is a Button with a 'save' icon and and
 * a button of type "submit".
 */
export default function SubmitButton({
  children,
  inProgress,
  size,
  className = '',
  onClick,
  iconSize
}: Props) {
  return (
    <Button
      type="submit"
      size={size}
      color="primary"
      inProgress={inProgress}
      className={`float-right ${className}`}
      onClick={onClick}
      icon="save"
      iconSize={iconSize}
    >
      {children}
    </Button>
  );
}
