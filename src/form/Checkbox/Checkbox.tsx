import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

import withJarb from '../withJarb/withJarb';
import { Color } from '../..';
import { doBlur } from '../utils';

type Props = {
  /**
   * The id of the form element.
   */
  id: string;

  /**
   * The value that the form element currently has.
   *
   * When the value is `true` the checkbox is checked.
   * When the value `false` the checkbox is unchecked.
   *
   * When the value is `undefined` it depends on `allowIndeterminate`,
   * when `allowIndeterminate` is `true` the checkbox is indeterminate.
   * when  `allowIndeterminate` is `false` the checkbox is unchecked.
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

  /**
   * The label of the form element.
   */
  label: React.ReactNode;

  /**
   * Optionally the placeholder of the form element.
   */
  placeholder?: string;

  /**
   * Optionally whether to support the indeterminate state.
   */
  allowIndeterminate?: boolean;
};

/**
 * Checkbox is a form element for when the value is a boolean.
 */
export default function Checkbox(props: Props) {
  const {
    id,
    onChange,
    onBlur,
    error,
    color,
    label,
    className = '',
    placeholder,
    value,
    valid,
    allowIndeterminate
  } = props;

  const checked = !!value;

  const invalid = valid === false ? true : undefined;

  function onClick() {
    onChange(!checked);
    doBlur(onBlur);
  }

  return (
    <FormGroup check className={className} color={color}>
      <Label for={id} check>
        <Input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onClick}
          valid={valid}
          invalid={invalid}
          innerRef={(e) => {
            if (e && allowIndeterminate) {
              // Value will be an empty string when coming from
              // final-form. So we do a ts-expect-error to go around
              // the fact that we say value is boolean | undefined.

              // @ts-expect-error Accept that a checkbox event has an indeterminate
              e.indeterminate = value === undefined || value === '';
            }
          }}
        />{' '}
        {label}
      </Label>

      {placeholder ? (
        <p className="text-muted mb-0">
          <em>{placeholder}</em>
        </p>
      ) : null}

      {error}
    </FormGroup>
  );
}

/**
 * Variant of the Checkbox which can be used in a Jarb context.
 */
export const JarbCheckbox = withJarb<boolean, boolean | null, Props>(Checkbox);
