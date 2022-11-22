import React from 'react';
import classNames from 'classnames';
import {
  BootstrapColor,
  Changeable,
  UIBasePropsWithCSSPropertiesAndChildren,
  WithColor,
  WithLabel,
  WithValue
} from '../types';
import { uniqueId } from 'lodash';
import { CheckBox } from '../CheckBox/CheckBox';

type Props = {
  /**
   * Optionally the id of the input element
   */
  id?: string;

  /**
   * Optional callback for when the Toggle is blurred.
   */
  onBlur?: React.FocusEventHandler;

  /**
   * Optionally whether the label should be invisible (aria-label).
   * This only works if label is a string.
   * Defaults to false.
   */
  hiddenLabel?: boolean;
} & WithLabel<React.ReactNode> &
  WithColor<BootstrapColor> &
  Changeable<boolean, void> &
  Partial<
    UIBasePropsWithCSSPropertiesAndChildren<React.ReactNode> &
      WithValue<boolean>
  >;

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
  hiddenLabel,
  ...props
}: Props) {
  const toggleClasses = classNames(
    'toggle-container',
    `toggle-${color}`,
    className
  );

  return (
    <span className={toggleClasses} {...props}>
      {!hiddenLabel || typeof label !== 'string' ? (
        <label className="d-inline-block toggle-label me-2" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <CheckBox
        id={id}
        onChange={(event) => onChange(event.target.checked)}
        checked={value}
        onBlur={onBlur}
        aria-label={
          hiddenLabel && typeof label === 'string' ? label : undefined
        }
      />
    </span>
  );
}
