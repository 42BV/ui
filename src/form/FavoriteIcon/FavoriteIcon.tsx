import React from 'react';
import Icon from '../../core/Icon/Icon';
import { useHover } from '../../hooks/useHover/useHover';

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
};

/**
 * FavoriteIcon displays a star icon to show the user
 * whether an item is favorite or not. The component
 * includes toggle functionality.
 */
export function FavoriteIcon({
  value,
  onChange,
  className = ''
}: FavoriteIconProps) {
  const [hover, hoverEvents] = useHover();

  return (
    <div {...hoverEvents}>
      <Icon
        color={value || hover ? 'primary' : 'secondary'}
        className={className}
        icon={value ? 'star' : 'star_border'}
        onClick={() => onChange(!value)}
      />
    </div>
  );
}
