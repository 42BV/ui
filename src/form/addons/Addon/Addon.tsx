import React, { ReactNode } from 'react';

export type AddonPosition = 'left' | 'right';

export type Props = {
  /**
   * The content of the addon.
   */
  children: ReactNode;

  /**
   * The position of the Addon, is it to the right or left
   * of the input.
   *
   * Defaults to 'left'
   */
  position?: AddonPosition;
};

/**
 * Defines an addon to use with an Input element. An addon is a little
 * box rendered to the left or right of an input element.
 *
 * Used to give extra context to an input field. A classic example
 * is using an addon with the value of "km" to show that the input's
 * unit is a kilometer.
 */
export function Addon({ children }: Props) {
  return (
    <>
      {children}
    </>
  );
}
