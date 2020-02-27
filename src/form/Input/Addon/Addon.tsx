import React from 'react';
import { Button, InputGroupAddon } from 'reactstrap';
import { Icon, IconType } from '../../../core/Icon';

import { Color } from '../../types';
import { Position } from '../types';

interface BaseProps {
  /**
   * Optionally the color of the Addon.
   */
  color?: Color;

  /**
   * The position of the Addon, is it to the right or left
   * of the input.
   */
  position: Position;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optional callback for when the addon is clicked.
   */
  onClick?: () => void;
}

interface IconProps extends BaseProps {
  /**
   * The icon to use as the Addon.
   */
  icon: IconType;

  text?: never;
}

interface TextProps extends BaseProps {
  /**
   * The text to use as the Addon.
   */
  text: string;

  icon?: never;
}

export type Props = IconProps | TextProps;

/**
 * Defines an addon to use with an Input element. An addon is a little
 * box rendered to the left or right of an input element. It contains
 * either an icon or a text.
 *
 * Used to give extra context to an input field. A classic example
 * is using an addon with the value of "km" to show that the input's
 * unit is a kilometer.
 */
export default function Addon({
  color,
  position,
  onClick,
  className = '',
  ...props
}: Props) {
  const addonType = position === 'left' ? 'prepend' : 'append';
  const buttonColor = !color ? 'primary' : color;

  return (
    <InputGroupAddon className={className} addonType={addonType}>
      {/* Tabindex set to -1 to avoid tabbing through it */}
      <Button
        className={onClick !== undefined ? 'clickable' : 'not-clickable'}
        tabIndex={-1}
        type="button"
        color={buttonColor}
        onClick={onClick}
      >
        {'text' in props ? props.text : <Icon icon={props.icon} />}
      </Button>
    </InputGroupAddon>
  );
}
