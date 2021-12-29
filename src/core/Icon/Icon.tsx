import React from 'react';
import classNames from 'classnames';

import { Color, useHover } from '../..';
import IconType from './types';

export type Props = {
  /**
   * The material icon you want to render.
   */
  icon: IconType;

  /**
   * Optional color you want the Icon to have.
   */
  color?: Color;

  /**
   * Optional color you want the Icon to have when it is hovered.
   * When `disabled` is true, hoverColor does not work.
   * This will only be used when onClick is defined.
   */
  hoverColor?: Color;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optional id when using controlled tooltips.
   */
  id?: string;

  /**
   * Optional onClick event for when the Icon is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;

  /**
   * Optionally whether the button is disabled
   *
   * Defaults to `false`
   */
  disabled?: boolean;

  /**
   * Optionally the size of the icon in pixels.
   *
   * Defaults to `24px`
   */
  size?: number;
};

/**
 * The Icon is a small wrapper around a material design icon.
 *
 * Useful for making sure your icon is typesafe via TypeScript.
 */
export default function Icon({
  className,
  onClick,
  icon,
  id,
  color,
  hoverColor,
  disabled,
  size
}: Props) {
  const [hover, hoverEvents] = useHover();

  const colorCssClasses = {};
  if (color) {
    colorCssClasses[`text-${color}`] = (hoverColor && !hover) || disabled || onClick === undefined;
  }
  if (hoverColor) {
    colorCssClasses[`text-${hoverColor}`] = hover && !disabled && onClick !== undefined;
  }

  const classes = classNames(
    'icon',
    className,
    'material-icons',
    colorCssClasses,
    {
      clickable: !disabled && onClick,
      'icon--disabled': disabled
    }
  );

  const style = size ? { fontSize: size } : undefined;

  return (
    <i
      id={id}
      style={style}
      onClick={(event) => {
        if (!disabled && onClick) {
          onClick(event);
        }
      }}
      className={classes}
      {...hoverEvents}
    >
      {icon}
    </i>
  );
}
