import React from 'react';
import { FormGroup, Label } from 'reactstrap';
import TextareaAutosize from 'react-textarea-autosize';
import classNames from 'classnames';

import { withJarb } from '../withJarb/withJarb';
import { FieldCompatible } from '../types';
import { uniqueId } from 'lodash';
import { withField } from '../withField/withField';

type Props = FieldCompatible<string, string>;

/**
 * Textarea is a basic form element which allows the user to enter large
 * texts, auto-grows when the user enters a lot of text.
 */
export function Textarea(props: Props) {
  const {
    id = uniqueId(),
    label,
    hiddenLabel,
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

  const inputProps = {
    id,
    value,
    placeholder,
    onChange: (event: { target: { value: string } }) =>
      onChange(event.target.value),
    onFocus,
    onBlur,
    'aria-label': hiddenLabel && typeof label === 'string' ? label : undefined
  };

  const classes = classNames('form-control', { 'is-invalid': valid === false });

  return (
    <FormGroup className={className} color={color}>
      {!hiddenLabel || typeof label !== 'string' ? (
        <Label for={id}>{label}</Label>
      ) : null}
      <TextareaAutosize className={classes} {...inputProps} />
      {error}
    </FormGroup>
  );
}

/**
 * Variant of the Textarea which can be used in a Jarb context.
 */
export const JarbTextarea = withJarb<string, string, Props>(Textarea);

/**
 * Variant of the Textarea which can be used in a final form.
 */
export const FieldTextarea = withField<string, string, Props>(Textarea);
