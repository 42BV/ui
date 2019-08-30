import React from 'react';
import classNames from 'classnames';
import { FormGroup, Label } from 'reactstrap';
import { Color } from '../types';

import withJarb from '../withJarb/withJarb';

interface Props {
  /**
   * The id of the form element.
   */
  id: string;

  /**
   * The label of the form element.
   */
  label: string;

  /**
   * The color of Toggle element.
   */
  toggleColor: Color;

  /**
   * The value that the form element currently has.
   */
  value?: boolean;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value: boolean) => void;

  /**
   * Optional callback for when the form element is blurred.
   */
  onBlur?: () => void;

  /**
   * Optionally the error message to render.
   */
  error?: React.ReactNode;

  /**
   * Optionally the color of the FormGroup.
   */
  color?: Color;

  /**
   * Whether or not the form element is currently valid.
   */
  valid?: boolean;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
}

/**
 * FormToggle is a a form element which allows the user to activate or
 * deactivate a certain state.
 */
export function FormToggle(props: Props) {
  const {
    id,
    label,
    value,
    color,
    toggleColor,
    onChange,
    onBlur,
    error,
    className = ''
  } = props;

  return (
    <FormGroup className={className} color={color}>
      <Label for={id}>
        {label}
        <Toggle
          id={id}
          color={toggleColor}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      </Label>

      {error}
    </FormGroup>
  );
}

/**
 * Variant of the FormToggle which can be used in a Jarb context.
 */
export const JarbFormToggle = withJarb<boolean, boolean, Props>(FormToggle);

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
