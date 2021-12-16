import React from 'react';
import { default as Icon, Props as IconProps } from '../Icon/Icon';
import { Color } from '../types';
import { useHover } from '../../hooks/useHover/useHover';

type Props = {
  /**
   * Whether the value to be displayed is either true or false.
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
   */
  color?: Color;

  /**
   * Optionally the color of the icon when value is true
   * or the icon is hovered. This is only used when onChange
   * is defined.
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
 * The BooleanIcon is a uniform non-interactive way to display whether
 * a value is either true or false.
 */
export function BooleanIcon({
  value,
  size,
  color,
  activeColor = 'primary',
  onChange,
  className
}: Props) {
  const [hover, hoverEvents] = useHover();

  const props: IconProps = {
    icon: value ? 'check_box' : 'check_box_outline_blank',
    size,
    className
  };

  if (onChange) {
    return (
      <div {...hoverEvents}>
        <Icon
          color={value || hover ? activeColor : color}
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.preventDefault();
            onChange();
          }}
          {...props}
        />
      </div>
    );
  }

  return <Icon color={color} {...props} />;
}
