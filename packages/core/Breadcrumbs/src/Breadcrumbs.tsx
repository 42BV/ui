import React from 'react';
import { Breadcrumb as RBreadcrumb, BreadcrumbItem, NavLink } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

interface BreadcrumbsProps {
  /**
   * Collection of breadcrumbs you would like to show.
   *
   * @default []
   */
  items: { url: string; name: string }[];
}

/**
 * Breadcrumbs is a component which shows the path the user has taken throughout the application.
 *
 * Use it when you want to provide the user an easy way to navigate back to a specific page.
 */
export default function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
  return (
    <div className="breadcrumb-wrapper">
      <RBreadcrumb className="ml-auto">
        {items.map(({ url, name }, index) => {
          return (
            <BreadcrumbItem key={index}>
              <NavLink to={url} exact tag={RRNavLink}>
                {name}
              </NavLink>
            </BreadcrumbItem>
          );
        })}
      </RBreadcrumb>
    </div>
  );
}
