import React from 'react';
import { Button } from 'reactstrap';
import { Color } from '../../../core/types';

import { Addon, AddonPosition, Props as AddonProps } from '../Addon/Addon';

export type Props = Omit<AddonProps, 'position'> & {
  /**
   * Optionally the color of the Addon.
   *
   * Defaults to "primary"
   */
  color?: Color;

  /**
   * The position of the Addon, is it to the right or left
   * of the input.
   *
   * Defaults to 'right'
   */
  position?: AddonPosition;

  /**
   * Callback for when the addon is clicked.
   */
  onClick: () => void;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

/**
 * Defines an addon to use with an Input element which is a button.
 * It is used to add an action to an Input element.
 */
export function AddonButton({
  children,
  color,
  position = 'right',
  onClick,
  className
}: Props) {
  return (
    <Addon position={position}>
      <Button
        // Tabindex set to -1 to avoid tabbing through it
        tabIndex={-1}
        type="button"
        color={!color ? 'primary' : color}
        onClick={onClick}
        className={className}
      >
        {children}
      </Button>
    </Addon>
  );
}
