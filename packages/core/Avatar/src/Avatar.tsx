import React, { ReactNode } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import classNames from 'classnames';
import { uniqueId } from 'lodash';

export type Size = 'xs' | 'sm' | 'md' | 'lg';

interface Props {
  src: string;
  children?: ReactNode;
  alt: string; // If an alt is added a tooltip will be shown
  size?: Size; // Size is optional because the default is medium size
  className?: string; // Optional classes
}

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
