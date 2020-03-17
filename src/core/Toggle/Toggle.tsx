import React from 'react';
import classNames from 'classnames';
import { Color } from '../../form/types';

interface ToggleProps {
  /**
   * Optionally the id of the input element
   */
  id?: string;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * The color of the element.
   */
  color: Color;

  /**
   * Optionally the value of the Toggle, when `true` it is active.
   * when `false` it is inactive. Defaults to `false`.
   */
  value?: boolean;

  /**
   * Callback for when the Toggle element is toggled.
   */
  onChange: (value: boolean) => void;

  /**
   * Optional callback for when the Toggle is blurred.
   */
  onBlur?: React.FocusEventHandler;
}

/**
 * Toggle is a component which looks like a switch. Use the Toggle
 * instead of a checkbox, when you want the changes to take effect
 * immediately.
 */
export default function Toggle({
  className,
  color,
  id,
  value = false,
  onChange,
  onBlur
}: ToggleProps) {
  const toggleClasses = classNames(
    'toggle-container',
    `toggle-${color}`,
    className
  );

  return (
    <span className={toggleClasses}>
      <input
        id={id}
        type="checkbox"
        onChange={event => onChange(event.target.checked)}
        checked={value}
        onBlur={onBlur}
      />
    </span>
  );
}
