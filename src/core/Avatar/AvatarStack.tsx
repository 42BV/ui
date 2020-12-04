import React from 'react';
import classNames from 'classnames';

type Props = {
  /**
   * Element underneath the image.
   */
  children: React.ReactNode;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

/**
 * AvatarStack is a component which shows a row of overlapped avatars.
 * Use it for instance when you want to show multiple thumbnails of users in an organized way.
 */
export default function AvatarStack({ children, className }: Props) {
  return (
    <div className={classNames('avatar-stack', className)}>{children}</div>
  );
}
