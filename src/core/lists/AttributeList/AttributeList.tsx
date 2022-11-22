import React from 'react';
import { ListGroup } from 'reactstrap';
import { UIBasePropsWithCSSPropertiesAndChildren } from '../../types';

type AttributeListProps = Partial<
  UIBasePropsWithCSSPropertiesAndChildren<React.ReactNode>
>;

/**
 * AttributeList when used with AttributeView is a way to display
 * object properties in a clear and beautiful list.
 */
export function AttributeList(props: AttributeListProps) {
  return (
    <ListGroup flush {...props}>
      {props.children}
    </ListGroup>
  );
}
