import React from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { NavItem, NavLink } from 'reactstrap';

import { Icon, IconType } from '@42.nl/ui-core-icon';
import { useCurrentUser } from '@42.nl/authentication';

interface Props {
  /**
   * String that corresponds to a route.
   *
   * @type {string}
   * @memberof Props
   */
  to: string;

  /**
   * Determines which icon to render above the text.
   *
   * @type {IconType}
   * @memberof Props
   */
  icon: IconType;

  /**
   * Link text as rendered underneath icon.
   *
   * @type {string}
   * @memberof Props
   */
  text?: string;

  /**
   * Guard that that prevents display by user role.
   *
   * @type {string}
   * @memberof Props
   */
  requiresRole?: string;
}

/**
 *
 *
 * @export NavigationItem
 * @param {Props} props
 * @returns {JSX.Element}
 */
export default function NavigationItem({
  requiresRole,
  to,
  icon,
  text
}: Props): JSX.Element {
  const currentUser = useCurrentUser<any>();
  const userRoles = currentUser.roles;

  if (requiresRole !== undefined && !userRoles.includes(requiresRole)) {
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
