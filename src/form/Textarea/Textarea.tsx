import React from 'react';
import { FormGroup, Label } from 'reactstrap';
import TextareaAutosize from 'react-textarea-autosize';
import classNames from 'classnames';

import withJarb from '../withJarb/withJarb';
import { Color } from '../types';

interface BaseProps {
  /**
   * The placeholder of the form element.
   */
  placeholder?: string;

  /**
   * The value that the form element currently has.
   */
  value?: string;

  /**
   * Callback for when the form element changes.
   */
  onChange: (value: string) => void;

  /**
   * Optional callback for when the form element is blurred.
   */
  onBlur?: () => void;

  /**
   * Optional callback for when the form element is focused.
   */
  onFocus?: () => void;

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

interface WithoutLabel extends BaseProps {
  id?: string;
  label?: never;
}

interface WithLabel extends BaseProps {
  /**
   * The id of the form element.
   */
  id: string;

  /**
   * The label of the form element.
   */
  label: string;
}

export type Props = WithoutLabel | WithLabel;

/**
 * Textarea is a basic form element which allows the user to enter large
 * texts, autogrows when the user enters a lot of text.
 */
export default function Textarea(props: Props) {
  const {
    id,
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
    onBlur
  };

  const classes = classNames('form-control', { 'is-invalid': valid === false });

  return (
    <FormGroup className={className} color={color}>
      {'label' in props && props.label ? (
        <Label for={props.id}>{props.label}</Label>
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
