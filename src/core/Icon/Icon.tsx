import React from 'react';
import classNames from 'classnames';

import { Color } from '../types';
import IconType from './types';

type Props = {
  /**
   * The material icon you want to render.
   */
  icon: IconType;

  /**
   * Optional color you want the Icon to have.
   */
  color?: Color;

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
  disabled,
  size
}: Props) {
  const colorCssClass = color !== undefined ? `text-${color}` : undefined;

  const classes = classNames(
    'icon',
    className,
    'material-icons',
    colorCssClass,
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
    >
      {icon}
    </i>
  );
}
