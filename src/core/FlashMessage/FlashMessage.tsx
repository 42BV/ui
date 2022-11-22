import React from 'react';
import { Alert } from 'reactstrap';
import classNames from 'classnames';

import { Closeable, UIBasePropsWithCSSPropertiesAndChildren } from '../types';

type FlashMessageProps = Partial<
  UIBasePropsWithCSSPropertiesAndChildren<React.ReactNode> &
    Closeable<any, void>
>;

/**
 * A FlashMessage is a message you want to show to the user briefly.
 *
 * Use it when you want to globally show a notification / message.
 */
export function FlashMessage({
  className,
  onClose,
  color,
  children,
  ...props
}: FlashMessageProps) {
  return (
    <div {...props} className={classNames('flash-message', className)}>
      <Alert color={color} open={true} toggle={onClose}>
        {children}
      </Alert>
    </div>
  );
}
