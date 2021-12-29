import React from 'react';
import Icon, { Props as IconProps } from '../Icon/Icon';
import { Color } from '../types';

type Props = {
  /**
   * Whether or not the process succeeded.
   */
  value: boolean;

  /**
   * Optionally the size of the icon in pixels.
   *
   * Defaults to `24px`
   */
  size?: number;

  /**
   * Optionally the color of the icon.
   * When onChange is defined, this property is used when
   * value is false and the icon is not hovered.
   *
   * Defaults to dark.
   */
  color?: Color;

  /**
   * Optional color you want the icon to have when it is hovered.
   * When hoverColor is not defined, activeColor will be used.
   */
  hoverColor?: Color;

  /**
   * Optionally the color of the icon when value is true.
   * Also used when hoverColor is not defined and the icon
   * is hovered. This is only used when onChange is defined.
   *
   * Defaults to primary.
   */
  activeColor?: Color;

  /**
   * Optional callback for when the form element changes.
   */
  onChange?: () => void;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

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
  const props: IconProps = {
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
