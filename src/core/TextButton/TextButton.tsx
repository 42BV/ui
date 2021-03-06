import React, { ReactNode } from 'react';

type Props = {
  /**
   * Callback for what needs to happen when the button is clicked.
   */
  onClick: (event: React.MouseEvent<HTMLElement>) => any;

  /**
   * The text of the TextButton
   */
  children: ReactNode;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

/**
 * The TextButton component is a special type of button which shows
 * like a styled text.
 */
export default function TextButton({ onClick, children, className }: Props) {
  return (
    <u
      role="button"
      className={`align-self-center clickable font-weight-lighter ${className ??
        ''}`}
      onClick={onClick}
    >
      {children}
    </u>
  );
}
