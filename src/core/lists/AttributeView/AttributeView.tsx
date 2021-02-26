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
};

/**
 * AttributeView is used inside AttributeList to display object properties
 * in a clear and beautiful list.
 */
export function AttributeView(props: Props) {
  const { label, children } = props;

  return (
    <ListGroupItem className="pl-0">
      <ListGroupItemHeading className="small text-primary">
        {label}
      </ListGroupItemHeading>
      {children}
    </ListGroupItem>
  );
}
