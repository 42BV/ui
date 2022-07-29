import React, { ChangeEvent } from 'react';
import RTMaskedInput from 'react-text-mask';
import { FormGroup, Input as RSInput, InputGroup, Label } from 'reactstrap';
import { withJarb } from '../withJarb/withJarb';

export type InputMask = (string | RegExp)[];

import { FieldCompatible } from '../types';
import { useId } from '../../hooks/useId/useId';

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
   * Optional mask of the input.
   *
   * @see https://text-mask.github.io/text-mask/
   */
  mask?: InputMask;

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
    id,
    label,
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
    mask,
    addon,
    className = ''
  } = props;

  const innerId = useId({ id });

  const inputProps = {
    id: innerId,
    type,
    valid,
    invalid: valid === false ? true : undefined,
    value,
    innerRef,
    placeholder: placeholder ? placeholder : '',
    onFocus,
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      onChange(event.target.value),
    onBlur
  };

  // Cannot pass a reference when the input requires a mask
  const { innerRef: _, ...withoutRef } = inputProps;

  const input =
    mask === undefined ? (
      <RSInput key="input" {...inputProps} />
    ) : (
      <RTMaskedInput
        key="mask"
        mask={mask}
        {...withoutRef}
        render={reactStrapInput}
      />
    );

  let content = input;

  if (addon !== undefined) {
    const addonPosition = addon.props.position ?? 'left';

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
      {label ? <Label for={innerId}>{label}</Label> : null}
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
