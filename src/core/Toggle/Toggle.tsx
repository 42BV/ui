import React from 'react';
import classNames from 'classnames';
import { Color } from '../types';
import { uniqueId } from 'lodash';

type Props = {
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

  /**
   * Label to display next to the toggle.
   */
  label: React.ReactNode;

  /**
   * Optionally whether the label should be invisible (aria-label).
   * This only works if label is a string.
   * Defaults to false.
   */
  hiddenLabel?: boolean;
};

/**
 * Toggle is a component which looks like a switch. Use the Toggle
 * instead of a checkbox, when you want the changes to take effect
 * immediately.
 */
export function Toggle({
  className,
  color,
  id = uniqueId(),
  value = false,
  onChange,
  onBlur,
  label,
  hiddenLabel
}: Props) {
  const toggleClasses = classNames(
    'toggle-container',
    `toggle-${color}`,
    className
  );

  return (
    <span className={toggleClasses}>
      {!hiddenLabel || typeof label !== 'string' ? (
        <label className="d-inline-block toggle-label me-2" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <input
        id={id}
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
        checked={value}
        onBlur={onBlur}
        aria-label={hiddenLabel && typeof label === 'string' ? label : undefined}
      />
    </span>
  );
}
