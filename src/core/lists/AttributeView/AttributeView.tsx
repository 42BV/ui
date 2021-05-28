import classnames from 'classnames';
import React from 'react';
import { ListGroupItem, ListGroupItemHeading } from 'reactstrap';

type Props = {
  /**
   * The heading to display above the value.
   */
  label: React.ReactNode;

  /**
   * The value described by the label.
   */
  children: React.ReactNode;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

/**
 * AttributeView is used inside AttributeList to display object properties
 * in a clear and beautiful list.
 */
export function AttributeView({ label, children, className }: Props) {
  return (
    <ListGroupItem className={classnames('pl-0', className)}>
      <ListGroupItemHeading className="small text-primary">
        {label}
      </ListGroupItemHeading>
      {children}
    </ListGroupItem>
  );
}
