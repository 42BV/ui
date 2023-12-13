import { ReactNode } from 'react';
import classNames from 'classnames';

import './AvatarStack.scss';

type Props = {
  /**
   * Element underneath the image.
   */
  children: ReactNode;

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
export function AvatarStack({ children, className }: Readonly<Props>) {
  return (
    <div className={classNames('avatar-stack', className)}>{children}</div>
  );
}
