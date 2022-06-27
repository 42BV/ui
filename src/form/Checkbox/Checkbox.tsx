import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

import { withJarb } from '../withJarb/withJarb';
import { doBlur } from '../utils';
import { uniqueId } from 'lodash';
import { FieldCompatible } from '../types';

type Props = FieldCompatible<boolean | undefined, boolean> & {
  /**
   * Optionally whether to support the indeterminate state.
   */
  allowIndeterminate?: boolean;
};

/**
 * Checkbox is a form element for when the value is a boolean.
 */
export function Checkbox(props: Props) {
  const {
    id = uniqueId(),
    onChange,
    onBlur,
    error,
    color,
    label,
    hiddenLabel,
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
          className="mr-2"
          aria-label={hiddenLabel && typeof label === 'string' ? label : undefined}
        />
        {!hiddenLabel || typeof label !== 'string' ? label : null}
      </Label>

      {placeholder ? (
        <p className="mb-0">
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
