import React from 'react';
import classNames from 'classnames';

import IconType from './types';

interface Props {
  /**
   * The material icon you want to render.
   *
   * @type {IconType}
   * @memberof Props
   */
  icon: IconType;

  /**
   * Optional color you want the Icon to have. Support bootstrap colors.
   *
   * @type {string}
   * @memberof Props
   */
  color?: string;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   *
   * @type {string}
   * @memberof Props
   */
  className?: string;

  /**
   * Optional id for when you need it for tooltips we sometimes do need it.
   *
   * @type {string}
   * @memberof Props
   */
  id?: string;

  /**
   * Optional onClick event for when the icon is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

/**
 * The Icon is a small wrapper around a material design icon.
 *
 * Useful for making sure your icon is typesafe via TypeScript.
 *
 * @export
 * @param {Props} props
 * @returns
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
