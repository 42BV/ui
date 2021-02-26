import React from 'react';
import { ListGroup } from 'reactstrap';

type Props = {
  /**
   * The content of the list.
   * This should be a combination of AttributeView components.
   */
  children: React.ReactNode;
};

/**
 * AttributeList when used with AttributeView is a way to display
 * object properties in a clear and beautiful list.
 */
export function AttributeList({ children }: Props) {
  return <ListGroup flush>{children}</ListGroup>;
}
