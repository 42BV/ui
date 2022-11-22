import React from 'react';
import { Icon } from '../Icon';
import { Changeable, IconProps, WithActiveColor, WithValue } from '../types';

type FavoriteIconProps = Omit<IconProps, 'icon'> &
  Changeable<boolean, void> &
  Partial<WithActiveColor> &
  WithValue<boolean>;

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
  hoverColor,
  ...props
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
      {...props}
    />
  );
}
