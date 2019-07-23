import React, { ReactNode } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import classNames from 'classnames';
import { uniqueId } from 'lodash';

export type Size = 'xs' | 'sm' | 'md' | 'lg';

interface Props {
  /**
   * Image URL to show as avatar.
   *
   * @type {string}
   * @memberof Props
   */
  src: string;

  /**
   * Element underneath the image.
   *
   * @type {React.ReactNode}
   * @memberof Props
   */
  children?: ReactNode;

  /**
   * Text that will be shown upon hovering over the image.
   *
   * @type {string}
   * @memberof Props
   */
  alt: string;

  /**
   * Optional size, where medium ('md') is the default size.
   *
   * @type {string}
   * @memberof Props
   */
  size?: Size; // Size is optional because the default is medium size

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   *
   * @type {string}
   * @memberof Props
   */
  className?: string;
}

/**
 * Avatar is a component which shows a circular image with any element underneath.
 *
 * Use it for instance for showing the profile image of a logged-in user.
 *
 * @export Avatar
 * @param {Props} props
 * @returns {JSX.Element}
 */
export default function Avatar({
  size,
  className,
  alt,
  src,
  children
}: Props): JSX.Element {
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
