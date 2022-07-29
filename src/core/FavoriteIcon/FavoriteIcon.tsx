import React from 'react';
import { Icon } from '../Icon';
import { Color } from '../types';

type FavoriteIconProps = {
  /**
   * The value that the form element currently has.
   */
  value: boolean;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value: boolean) => void;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optionally the size of the icon in pixels.
   *
   * Defaults to `24px`
   */
  size?: number;

  /**
   * Optionally the color of the icon when value is false
   * and the icon is not hovered.
   *
   * Defaults to secondary.
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
   * is hovered.
   *
   * Defaults to primary.
   */
  activeColor?: Color;
};

/**
 * FavoriteIcon displays a star icon to show the user
 * whether an item is favorite or not. The component
 * includes toggle functionality.
 */
export function FavoriteIcon({
  value,
  onChange,
  className = '',
  size,
  color = 'secondary',
  activeColor = 'primary',
  hoverColor
}: FavoriteIconProps) {
  function onClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    onChange(!value);
  }

  return (
    <Icon
      color={value ? activeColor : color}
      hoverColor={hoverColor ? hoverColor : activeColor}
      className={className}
      icon={value ? 'star' : 'star_border'}
      onClick={onClick}
      size={size}
    />
  );
}
