import React from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { NavItem, NavLink } from 'reactstrap';

import { Icon, IconType } from '@42.nl/ui-core-icon';

interface Props {
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
   * Predicate to determine if the link will be shown.
   */
  show?: (() => boolean) | boolean;
}

/**
 * The NavigationItem enables you to guard specific links by a predicate, for example by user role.
 *
 * Use it when you want to keep certain navigation items hidden for specific user roles.
 */
export default function NavigationItem({ to, icon, text, show = true }: Props) {
  const shouldShow = typeof show === 'function' ? show : () => show;

  if (!shouldShow()) {
    return null;
  }

  return (
    <NavItem>
      <NavLink to={to} exact tag={RRNavLink} activeClassName="active">
        <Icon icon={icon} className="mr-3 align-bottom" />
        {text}
      </NavLink>
    </NavItem>
  );
}
