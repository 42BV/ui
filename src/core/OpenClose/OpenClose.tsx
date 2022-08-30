import React from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon';

type Props = {
  /**
   * Whether the collapsable element is currently open.
   */
  open: boolean;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

/**
 * Open and close icon with a nice animation to display whether a collapsable
 * element is open or closed. This is often used in the header of a card with
 * a collapsable body.
 */
export function OpenClose({ open, className }: Props) {
  const classes = classNames(
    'open-close',
    open ? 'is-open' : 'is-closed',
    className
  );

  return <Icon icon="expand_more" className={classes} />;
}
