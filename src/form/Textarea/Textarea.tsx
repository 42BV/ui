import React from 'react';
import { FormGroup, Label } from 'reactstrap';
import TextareaAutosize from 'react-textarea-autosize';
import classNames from 'classnames';

import { withJarb } from '../withJarb/withJarb';
import { FieldCompatible } from '../types';
import { useId } from '../../hooks/useId/useId';

type Props = FieldCompatible<string, string>;

/**
 * Textarea is a basic form element which allows the user to enter large
 * texts, autogrows when the user enters a lot of text.
 */
export function Textarea(props: Props) {
  const {
    id,
    label,
    placeholder,
    onBlur,
    onFocus,
    onChange,
    value,
    color,
    error,
    valid,
    className = ''
  } = props;

  const innerId = useId({ id });

  const inputProps = {
    id: innerId,
    value,
    placeholder,
    onChange: (event: { target: { value: string } }) =>
      onChange(event.target.value),
    onFocus,
    onBlur
  };

  const classes = classNames('form-control', { 'is-invalid': valid === false });

  return (
    <FormGroup className={className} color={color}>
      {label ? <Label for={innerId}>{label}</Label> : null}
      <TextareaAutosize className={classes} {...inputProps} />
      {error}
    </FormGroup>
  );
}

/**
 * Variant of the Textarea which can be used in a Jarb context.
 */
export const JarbTextarea = withJarb<string, string, Props>(Textarea);
