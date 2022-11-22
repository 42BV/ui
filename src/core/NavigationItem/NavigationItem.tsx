import React from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { NavItem, NavLink } from 'reactstrap';
import classNames from 'classnames';

import { Icon } from '../Icon';
import { IconType } from '../types';

type Props = {
  /**
   * String that corresponds to a route.
   */
  to: string;

  /**
   * Determines which icon to render above the text.
   */
  icon: IconType;

  /**
   * Link text as rendered underneath icon.
   */
  text?: string;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Predicate to determine if the link will be shown. Accepts either a boolean or a function that returns a boolean.
   */
  show?: (() => boolean) | boolean;
};

/**
 * The NavigationItem is a wrapper around the `react-router`'s
 * `NavLink`. See https://reacttraining.com/react-router/web/api/NavLink.
 * It adds texts and icons around the `NavLink`.
 *
 * The NavigationItem enables you to guard specific links by a predicate,
 * for example by user role.
 *
 * Use it when you want to keep certain navigation items hidden
 * for specific user roles.
 *
 * By default, the `NavigationItem` will render an `exact` link. See:
 * https://reacttraining.com/react-router/web/api/Route/exact-bool.
 * But you can set it to `false` via the props.
 */
export function NavigationItem({
  to,
  icon,
  text,
  show = true,
  className
}: Props) {
  const shouldShow = typeof show === 'function' ? show : () => show;

  if (!shouldShow()) {
    return null;
  }

  return (
    <NavItem className={classNames('navigation-item', className)}>
      <NavLink to={to} tag={RRNavLink}>
        <Icon icon={icon} className="me-3 align-bottom" />
        {text}
      </NavLink>
    </NavItem>
  );
}
