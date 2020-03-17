import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

import withJarb from '../withJarb/withJarb';
import { FieldCompatible } from '../types';
import { doBlur } from '../utils';
import { useId } from '../../hooks/useId/useId';

type Props = Omit<FieldCompatible<boolean, boolean>, 'value' | 'label'> & {
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
   * The label of the form element.
   */
  label: React.ReactNode;

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
    label,
    value,
    onChange,
    onFocus,
    onBlur,
    valid,
    error,
    placeholder,
    color,
    className = '',
    allowIndeterminate
  } = props;

  const checked = !!value;

  const invalid = valid === false ? true : undefined;

  const innerId = useId({ id });

  function onClick() {
    onChange(!checked);
    doBlur(onBlur);
  }

  return (
    <FormGroup check className={className} color={color}>
      <Label for={innerId} check>
        <Input
          id={innerId}
          type="checkbox"
          checked={checked}
          onChange={onClick}
          onFocus={onFocus}
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
