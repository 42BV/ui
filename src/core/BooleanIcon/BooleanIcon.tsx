import React from 'react';
import { Icon } from '../Icon';
import { Changeable, IconProps, WithActiveColor, WithValue } from '../types';

type BooleanIconProps = Partial<
  IconProps & WithValue<boolean> & Changeable<void, void> & WithActiveColor
>;

/**
 * The BooleanIcon is a uniform non-interactive way to display whether
 * a value is either true or false.
 */
export function BooleanIcon({
  value,
  size,
  activeColor = 'primary',
  onChange,
  className,
  color,
  hoverColor,
  ...otherProps
}: BooleanIconProps) {
  const props: BooleanIconProps = {
    icon: value ? 'check_box' : 'check_box_outline_blank',
    size,
    className,
    ...otherProps
  };

  if (onChange) {
    return (
      <Icon
        color={value ? activeColor : color}
        hoverColor={hoverColor ? hoverColor : activeColor}
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          onChange();
        }}
        {...props}
      />
    );
  }

  return <Icon color={color} {...props} />;
}
