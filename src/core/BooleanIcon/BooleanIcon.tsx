import React from 'react';
import Icon from '../Icon/Icon';
import { Color } from '../types';

type Props = {
  /**
   * Whether the value to be displayed is either true or false.
   */
  value: boolean;

  /**
   * Optionally the size of the icon.
   */
  size?: number;

  /**
   * Optional color you want the Icon to have.
   */
  color?: Color;
};

/**
 * The BooleanIcon is a uniform non-interactive way to display whether
 * a value is either true or false.
 */
export function BooleanIcon(props: Props) {
  const { value, size, color } = props;

  const icon = value ? 'check_box' : 'check_box_outline_blank';

  return <Icon icon={icon} color={color} size={size} />;
}
