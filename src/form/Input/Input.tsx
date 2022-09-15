import React, { ChangeEvent } from 'react';
import { FormGroup, Input as RSInput, InputGroup, Label } from 'reactstrap';
import { withJarb } from '../withJarb/withJarb';
import { FieldCompatible } from '../types';
import { uniqueId } from 'lodash';
import { withField } from '../withField/withField';

export type InputType =
  | 'text'
  | 'email'
  | 'select'
  | 'file'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'textarea'
  | 'button'
  | 'reset'
  | 'submit'
  | 'date'
  | 'datetime-local'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'range'
  | 'search'
  | 'tel'
  | 'url'
  | 'week'
  | 'password'
  | 'datetime'
  | 'time'
  | 'color';

export type Props = FieldCompatible<string, string> & {
  /**
   * Optional type of the input, default to `text`.
   */
  type?: InputType;

  /**
   * Optional addon to display to the left or right of the input
   * element. Provide either an Addon, AddonIcon or AddonButton to be
   * rendered here.
   *
   * The `position` property of the addon determines were the addon
   * is rendered.
   */
  addon?: React.ReactElement;

  /**
   * The position of the Addon, is it to the right or left
   * of the input.
   *
   * Defaults to 'left'
   */
  addonPosition?: 'left' | 'right';

  /**
   * A ref to the actual input, can be used to focus the element.
   */
  innerRef?: React.Ref<HTMLInputElement>;
};

/**
 * Input is a basic form element which allows the user to enter text.
 *
 * Supports addons and masks.
 */
export function Input(props: Props) {
  const {
    id = uniqueId(),
    label,
    hiddenLabel,
    placeholder,
    value,
    onChange,
    onBlur,
    onFocus,
    innerRef,
    type = 'text',
    error,
    color,
    valid,
    addon,
    addonPosition = 'left',
    className = ''
  } = props;

  const inputProps = {
    id,
    type,
    valid,
    invalid: valid === false ? true : undefined,
    value,
    innerRef,
    placeholder,
    onFocus,
    onChange: (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
    onBlur,
    'aria-label': hiddenLabel && typeof label === 'string' ? label : undefined
  };

  const input = <RSInput key="input" {...inputProps} />;

  let content = input;

  if (addon !== undefined) {
    if (addonPosition === 'left') {
      content = (
        <InputGroup>
          {addon}
          {input}
        </InputGroup>
      );
    } else {
      content = (
        <InputGroup>
          {input}
          {addon}
        </InputGroup>
      );
    }
  }

  return (
    <FormGroup className={className} color={color}>
      {!hiddenLabel ? <Label for={id}>{label}</Label> : null}
      {content}
      {error}
    </FormGroup>
  );
}

export function reactStrapInput(
  ref: (input: HTMLInputElement) => void,
  props: Record<string, any>
) {
  return <RSInput innerRef={ref} {...props} />;
}

/**
 * Variant of the Input which can be used in a Jarb context.
 */
export const JarbInput = withJarb<string, string, Props>(Input);

/**
 * Variant of the Input which can be used in a final form.
 */
export const FieldInput = withField<string, string, Props>(Input);
