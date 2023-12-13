import { ListGroup } from 'reactstrap';
import { ReactNode } from 'react';

type Props = {
  /**
   * The content of the list.
   * This should be a combination of AttributeView components.
   */
  children: ReactNode;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

/**
 * AttributeList when used with AttributeView is a way to display
 * object properties in a clear and beautiful list.
 */
export function AttributeList({ children, className }: Props) {
  return (
    <ListGroup flush className={className}>
      {children}
    </ListGroup>
  );
}
