import React from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon';

type Props = {
  /**
   * Whether or not the collapsable element is currently open.
   */
  open: boolean;
};

/**
 * Open and close icon with a nice animation to display whether a collapsable
 * element is open or closed. This is often used in the header of a card with
 * a collapsable body.
 */
export function OpenClose({ open }: Props) {
  const classes = classNames('open-close', open ? 'is-open' : 'is-closed');

  return <Icon icon="expand_more" className={classes} />;
}
