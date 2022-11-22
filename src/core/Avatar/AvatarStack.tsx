import React from 'react';
import classNames from 'classnames';
import { UIBasePropsWithCSSProperties, WithChildren } from '../types';

type AvatarStackProps = Partial<Omit<UIBasePropsWithCSSProperties, 'roles'>> &
  WithChildren<React.ReactNode>;

/**
 * AvatarStack is a component which shows a row of overlapped avatars.
 * Use it for instance when you want to show multiple thumbnails of users in an organized way.
 */
export function AvatarStack({
  className,
  children,
  ...props
}: AvatarStackProps) {
  return (
    <div className={classNames('avatar-stack', className)} {...props}>
      {children}
    </div>
  );
}
