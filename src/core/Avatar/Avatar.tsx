import React from 'react';
import classNames from 'classnames';
import {
  BootstrapSize,
  ImageProps,
  KeyValueMapping,
  ToolTipProps,
  UIBasePropsWithCSSPropertiesAndChildren,
  WithSize
} from '../types';
import { Tooltip } from '../Tooltip/Tooltip';

const TOOLTIP_DISTANCE_MAPPING: KeyValueMapping<number> = {
  lg: 42,
  md: 32,
  sm: 22
};

type ToolTipPropsWithoutChildren = Omit<ToolTipProps, 'children'>;

type AvatarProps = {
  tooltipProps?: Partial<ToolTipPropsWithoutChildren>;
  imgProps: Partial<ImageProps>;
} & Partial<
  UIBasePropsWithCSSPropertiesAndChildren<React.ReactNode> &
    WithSize<BootstrapSize> &
    Omit<HTMLSpanElement, 'children'>
>;

/**
 * Avatar is a component which shows a circular image with any element underneath.
 * Use it for instance for showing the profile image of a logged-in user.
 */
export function Avatar({
  size,
  children,
  className,
  tooltipProps,
  imgProps,
  ...props
}: AvatarProps) {
  const sizeClass = size ? `avatar-${size}` : null;
  const classes = classNames('avatar', sizeClass, className);
  const { alt, src, ...other } = imgProps;

  return (
    <span className={classes}>
      <Tooltip
        content={alt}
        placement="top"
        distance={TOOLTIP_DISTANCE_MAPPING[!!size ? size : 'default']}
        {...props}
      >
        <span className="img-placeholder">
          <img alt={alt} src={src} {...other} />
        </span>
        {children}
      </Tooltip>
    </span>
  );
}
