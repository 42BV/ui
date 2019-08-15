import React from 'react';
import { Breadcrumb as RBreadcrumb, BreadcrumbItem, NavLink } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import classNames from 'classnames';

interface InactiveItem {
  /**
   * Url to navigate to the page.
   */
  url: string;

  /**
   * Name of the link that will get displayed.
   */
  name: string;
}

interface ActiveItem {
  /**
   * Name associated with the link.
   */
  name: string;

  /**
   * Determines wether a Breadcrumb item is active,
   * in this case an url is not required.
   */
  active: boolean;
}

export type ItemProps = InactiveItem | ActiveItem;

interface BreadcrumbsProps {
  /**
   * Collection of breadcrumbs you would like to show.
   *
   */
  items: ItemProps[];

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
}

/**
 * Breadcrumbs is a component which shows the path the user has taken throughout the application.
 *
 * Use it when you want to provide the user an easy way to navigate back to a specific page.
 */
export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <div className={classNames('breadcrumb-wrapper', className)}>
      <RBreadcrumb className="ml-auto">
        {items.map(item => {
          const active = 'active' in item;
          const name = item.name;
          const url = 'url' in item ? item.url : undefined;

          return (
            <BreadcrumbItem key={name} active={active}>
              {active ? (
                <span>{name}</span>
              ) : (
                <NavLink to={url} exact tag={RRNavLink}>
                  {name}
                </NavLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </RBreadcrumb>
    </div>
  );
}
