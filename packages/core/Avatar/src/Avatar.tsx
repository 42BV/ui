import React, { ReactNode } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import classNames from 'classnames';
import uniqueId from 'lodash.uniqueid';

export type Size = 'xs' | 'sm' | 'md' | 'lg';

interface Props {
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
  size?: 'xs' | 'sm' | 'md' | 'lg';

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
}

/**
 * Avatar is a component which shows a circular image with any element underneath.
 * Use it for instance for showing the profile image of a logged-in user.
 */
export default function Avatar({ size, className, alt, src, children }: Props) {
  const sizeClass = size ? `avatar-${size}` : null;
  const classes = classNames('avatar', sizeClass, className);
  const tooltip = uniqueId('tooltip');

  return (
    <span className={classes}>
      <UncontrolledTooltip placement="top" target={tooltip} delay={250}>
        {alt}
      </UncontrolledTooltip>

      <span id={tooltip} className="img-placeholder">
        <img alt={alt} src={src} />
      </span>

      {children}
    </span>
  );
}
