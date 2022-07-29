import React from 'react';
import { Badge } from 'reactstrap';
import classNames from 'classnames';
import { Color } from '../types';

type Props = {
  /**
   * The element you want to add the InfoBadge to.
   */
  children: React.ReactNode;

  /**
   * The color of the badge. Supports Bootstrap colors (e.g. primary, danger).
   */
  color: Color;

  /**
   * The string or number to show in the badge.
   */
  value: string | number;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

/**
 * InfoBadge is a badge which shows up on the top right of an element.
 *
 * Use it when you want to show a notification / message count above
 * an element.
 */
export function InfoBadge({
  color,
  value,
  children,
  className
}: Props) {
  return (
    <span className={classNames('info-badge-container', className)}>
      {children}
      <Badge color={color} pill>
        {value}
      </Badge>
    </span>
  );
}
