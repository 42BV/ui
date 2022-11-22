import React from 'react';
import { Icon } from '../Icon';
import { BootstrapColor, Changeable, IconProps } from '../types';

type Props = {
  value: boolean;

  /**
   * Optionally the color of the icon when value is true.
   * Also used when hoverColor is not defined and the icon
   * is hovered. This is only used when onChange is defined.
   *
   * Defaults to primary.
   */
  activeColor?: BootstrapColor;
} & Partial<Omit<IconProps, 'icon'>> &
  Changeable<void, void>;

/**
 * SuccessIcon is used to display whether a process succeeded or not
 * based on a boolean value.
 */
export function SuccessIcon({
  value,
  size,
  color = 'dark',
  activeColor = 'primary',
  hoverColor,
  onChange,
  className
}: Props) {
  const props: Partial<IconProps> = {
    icon: value ? 'done' : 'clear',
    size,
    className
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
