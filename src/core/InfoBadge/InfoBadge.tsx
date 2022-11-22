import React from 'react';
import { Badge } from 'reactstrap';
import classNames from 'classnames';
import { UIBasePropsWithCSSPropertiesAndChildren, WithValue } from '../types';

type InfoBadgeProps = Partial<
  UIBasePropsWithCSSPropertiesAndChildren<React.ReactNode>
> &
  WithValue<string | number>;

/**
 * InfoBadge is a badge which shows up on the top right of an element.
 *
 * Use it when you want to show a notification / message count above
 * an element.
 */
export function InfoBadge({
  color,
  value,
  className,
  children,
  ...props
}: InfoBadgeProps) {
  return (
    <span className={classNames('info-badge-container', className)} {...props}>
      {children}
      <Badge color={color} pill>
        {value}
      </Badge>
    </span>
  );
}
