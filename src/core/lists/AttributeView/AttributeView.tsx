import classnames from 'classnames';
import React from 'react';
import { ListGroupItem, ListGroupItemHeading } from 'reactstrap';
import {
  UIBasePropsWithCSSProperties,
  WithChildren,
  WithLabel
} from '../../types';

type AttributeViewProps = WithChildren<React.ReactNode> &
  WithLabel<React.ReactNode> &
  Partial<UIBasePropsWithCSSProperties>;

/**
 * AttributeView is used inside AttributeList to display object properties
 * in a clear and beautiful list.
 */
export function AttributeView({ label, ...props }: AttributeViewProps) {
  return (
    <ListGroupItem {...props} className={classnames('pl-0', props.className)}>
      <ListGroupItemHeading className="small text-primary">
        {label}
      </ListGroupItemHeading>
      {props.children}
    </ListGroupItem>
  );
}
