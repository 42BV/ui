import React, { CSSProperties } from 'react';
import classNames from 'classnames';

import { IconProps } from '../types';
import { useHover } from '../../hooks/useHover/useHover';

/**
 * The Icon is a small wrapper around a material design icon.
 *
 * Useful for making sure your icon is typesafe via TypeScript.
 */
export function Icon({
  className,
  onClick,
  icon,
  id,
  color,
  hoverColor,
  disabled,
  size,
  ...props
}: Partial<IconProps>) {
  const [hover, hoverEvents] = useHover();

  const colorCssClasses = {};
  if (hoverColor && hover && !disabled && onClick !== undefined) {
    colorCssClasses[`text-${hoverColor}`] = true;
  } else if (color) {
    colorCssClasses[`text-${color}`] = true;
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

  const style = determineStyle(props.style, size);

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
      {...props}
    >
      {icon}
    </i>
  );
}

function determineStyle(
  style: Partial<CSSProperties> | undefined,
  size: number | undefined
): Partial<CSSProperties> | undefined {
  if (style !== undefined) return style;
  return size === undefined ? size : { fontSize: size };
}
