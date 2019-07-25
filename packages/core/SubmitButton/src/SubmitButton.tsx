import React from 'react';

import Button from '@42.nl/ui-core-button';
import { Icon } from '@42.nl/ui-core-icon';

export interface Props {
  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optionally the size of the button, defaults to md.
   *
   * @default "md"
   */
  size?: 'lg' | 'sm' | 'md';

  /**
   * Callback for what needs to happen when the button is clicked.
   */
  onClick: (event: React.MouseEvent<HTMLElement>) => any;

  /**
   * The text of the button.
   */
  children?: React.ReactNode;

  /**
   * Whether or not the action you are performing is currenlty in
   * progress. If so a spinner is rendered inside of the button.
   */
  inProgress: boolean;
}

/**
 * A SubmitButton is a Button with a 'save' icon and and
 * a button of type "submit".
 */
export default function SubmitButton({
  children,
  inProgress,
  size,
  className = '',
  onClick
}: Props) {
  return (
    <Button
      type="submit"
      size={size}
      color="primary"
      inProgress={inProgress}
      className={`float-right ${className}`}
      onClick={onClick}
    >
      <Icon icon="save" /> {children}
    </Button>
  );
}
