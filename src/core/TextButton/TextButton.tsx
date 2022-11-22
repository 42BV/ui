import React from 'react';
import classNames from 'classnames';
import { ButtonProps } from '../types';

/**
 * The TextButton component is a special type of button which shows
 * like a styled text.
 */
export function TextButton({
  onClick,
  children,
  className,
  ...props
}: Omit<
  ButtonProps<React.ReactNode>,
  'contentEditable' | 'style' | 'translate' | 'prefix' | 'inputMode' | 'role'
>) {
  return (
    <u
      role="button"
      className={classNames(
        'align-self-center clickable fw-lighter',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </u>
  );
}
