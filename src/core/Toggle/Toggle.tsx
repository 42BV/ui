import classNames from 'classnames';
import { Color } from '../types';
import { uniqueId } from 'lodash';

import './Toggle.scss';
import { FocusEventHandler, ReactNode } from 'react';

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
  onBlur?: FocusEventHandler;

  /**
   * Label to display next to the toggle.
   */
  label: ReactNode;

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
  return (
    <span className={classNames('toggle-container', className)}>
      <input
        id={id}
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
        checked={value}
        onBlur={onBlur}
        aria-label={
          hiddenLabel && typeof label === 'string' ? label : undefined
        }
        className={classNames('toggle', `border-${color}`, {
          [`bg-${color}-subtle`]: !value,
          [`bg-${color}`]: value
        })}
      />
      {!hiddenLabel || typeof label !== 'string' ? (
        <label className="d-inline-block toggle-label ms-2" htmlFor={id}>
          {label}
        </label>
      ) : null}
    </span>
  );
}
