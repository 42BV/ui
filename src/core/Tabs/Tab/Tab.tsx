import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Icon, IconType } from '../../Icon';
import { Color } from '../../types';
import { alwaysTrue } from '../../../form/utils';
import classNames from 'classnames';

export type Props = {
  /**
   * The label to display in the tab navigation.
   */
  label: string;

  /**
   * Callback that should activate the tab.
   *
   * We highly recommend adding the tab as a URL parameter,
   * especially if the inactive tabs are not hidden by CSS.
   */
  onClick: () => void;

  /**
   * Callback to render the tab content.
   */
  children: () => React.ReactNode;

  /**
   * Whether the tab content should be displayed.
   */
  active: boolean;

  /**
   * Optional boolean to determine if the tab navigation item should be disabled.
   *
   * Defaults to false.
   */
  disabled?: boolean;

  /**
   * Optional callback to determine if the tab should be displayed.
   * This is useful if you have to do permission checks to determine
   * if the user is allowed to see the tab content.
   *
   * By default, tabs will always be displayed.
   */
  show?: () => boolean;

  /**
   * Optional icon to be displayed in front of the label in the tab navigation.
   */
  icon?: IconType;

  /**
   * Optional color the icon should have.
   * This is useful when using tabs in a form and an inactive tab
   * contains validation errors.
   */
  iconColor?: Color;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

/**
 * The Tab component displays a tab navigation item and holds the content
 * that will only be displayed when the tab is active.
 * This component should only be used inside the Tabs component.
 */
export function Tab({
  icon,
  label,
  onClick,
  active,
  show = alwaysTrue,
  disabled,
  iconColor,
  className
}: Props) {
  if (!show()) {
    return null;
  }

  return (
    <NavItem className={classNames({ disabled }, className)}>
      <NavLink active={active} onClick={onClick} disabled={disabled}>
        <div className="d-flex p-2 justify-content-center">
          {icon ? (
            <Icon icon={icon} color={iconColor} className="me-1" />
          ) : null}
          {label}
        </div>
      </NavLink>
    </NavItem>
  );
}
