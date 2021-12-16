import React from 'react';
import Icon, { Props as IconProps } from '../Icon/Icon';
import { Color } from '../types';
import { useHover } from '../../hooks/useHover/useHover';

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
 * SuccessIcon is used to display whether a process succeeded or not
 * based on a boolean value.
 */
export function SuccessIcon({
  value,
  size,
  color = 'dark',
  activeColor = 'primary',
  onChange,
  className
}: Props) {
  const [hover, hoverEvents] = useHover();

  const props: IconProps = {
    icon: value ? 'done' : 'clear',
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
