import React from 'react';
import { Badge } from 'reactstrap';
import classNames from 'classnames';

interface Props {
  /**
   * The element you want to add the InfoBadge to.
   *
   * @type {React.ReactNode}
   * @memberof Props
   */
  children: React.ReactNode;

  /**
   * The color of the badge, accepts bootstrap colors.
   */
  color: string;

  /**
   * The string or number to show in the badge.
   */
  value: string | number;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   *
   * @type {string}
   * @memberof Props
   */
  className?: string;
}

/**
 * InfoBadge is a badge which shows up on the top right of an element.
 *
 * Use it when you want to show a notification / message count above
 * an element.
 *
 * @export
 * @param {Props} props
 * @returns
 */
export default function InfoBadge(props: Props) {
  const { color, value, children, className } = props;
  return (
    <span className={classNames('info-badge-container', className)}>
      {children}
      <Badge color={color} pill>
        {value}
      </Badge>
    </span>
  );
}
