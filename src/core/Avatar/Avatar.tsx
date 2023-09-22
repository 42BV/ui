import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { Tooltip } from '../Tooltip/Tooltip';

type Props = {
  /**
   * Image URL to show as avatar.
   */
  src: string;

  /**
   * Element underneath the image.
   */
  children?: ReactNode;

  /**
   * Text that will be shown upon hovering over the image.
   */
  alt: string;

  /**
   * Optional size.
   *
   * @default md
   */
  size?: AvatarSize;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Avatar is a component which shows a circular image with any element underneath.
 * Use it for instance for showing the profile image of a logged-in user.
 */
export function Avatar({ size, className, alt, src, children }: Props) {
  const sizeClass = size ? `avatar-${size}` : null;
  const classes = classNames('avatar', sizeClass, className);

  return (
    <span className={classes}>
      <Tooltip
        placement="top"
        content={alt}
        distance={tooltipDistanceFromSize(size)}
      >
        <span className="img-placeholder">
          <img alt={alt} src={src} />
        </span>
        {children}
      </Tooltip>
    </span>
  );
}

function tooltipDistanceFromSize(size?: AvatarSize): number {
  switch (size) {
    case 'lg':
      return 42;
    case 'md':
      return 32;
    case 'sm':
      return 22;
  }

  return 7;
}
