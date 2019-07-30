import React from 'react';
import classNames from 'classnames';
import { Color } from '@42.nl/ui-core-types';

import IconType from './types';

interface Props {
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
}

/**
 * The Icon is a small wrapper around a material design icon.
 *
 * Useful for making sure your icon is typesafe via TypeScript.
 */
export default function Icon({ className, onClick, icon, id, color }: Props) {
  const colorCssClass = color !== undefined ? `text-${color}` : undefined;
  const classes = classNames(className, 'material-icons', colorCssClass, {
    clickable: onClick
  });

  return (
    <i id={id} onClick={onClick} className={classes}>
      {icon}
    </i>
  );
}
