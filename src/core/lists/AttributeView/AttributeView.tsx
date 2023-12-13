import classnames from 'classnames';
import { ListGroupItem, ListGroupItemHeading } from 'reactstrap';
import { ReactNode } from 'react';

type Props = {
  /**
   * The heading to display above the value.
   */
  label: ReactNode;

  /**
   * The value described by the label.
   */
  children: ReactNode;

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
