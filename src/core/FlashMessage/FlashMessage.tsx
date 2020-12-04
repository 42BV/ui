import React from 'react';
import { Alert } from 'reactstrap';
import classNames from 'classnames';

import { Color } from '../types';

type Props = {
  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optional callback for what needs to happen when the flash-message is closed.
   */
  onClose?: () => void;

  /**
   * Optionally the color of the button.
   */
  color?: Color;

  /**
   * The text of the flash message.
   */
  children: React.ReactNode;
};

/**
 * A FlashMessage is a message you want to show to the user briefly.
 *
 * Use it when you want to globally show a notification / message.
 */
export default function FlashMessage({
  className,
  onClose,
  color,
  children
}: Props) {
  return (
    <div className={classNames('flash-message', className)}>
      <Alert color={color} open={true} toggle={onClose}>
        {children}
      </Alert>
    </div>
  );
}
