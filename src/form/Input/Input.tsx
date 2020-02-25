import React, { ChangeEvent } from 'react';
import RTMaskedInput from 'react-text-mask';
import { FormGroup, Input as RSInput, InputGroup, Label } from 'reactstrap';
import { InputType } from 'reactstrap/lib/Input';
import withJarb from '../withJarb/withJarb';

import Addon, { Props as AddonProps } from './Addon/Addon';

import { Mask } from './types';
import { Color } from '../types';

interface BaseProps {
  /**
   * The placeholder of the form element.
   */
  placeholder?: string | null;

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
   * Optional type of the input, default to `text`.
   */
  type?: InputType;

  /**
   * Optional mask of the input.
   *
   * @see https://text-mask.github.io/text-mask/
   */
  mask?: Mask;

  /**
   * Optional addon to display to the left or right of the input
   * element.
   */
  addon?: AddonProps;

  /**
   * A ref to the actual input, can be used to focus the element.
   */
  innerRef?: React.Ref<HTMLInputElement>;

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
 * Input is a basic form element which allows the user to enter text.
 *
 * Supports addons and masks.
 */
export default function Input(props: Props) {
  const {
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

  const inputProps = {
    id: 'id' in props ? props.id : undefined,
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
    const { position } = addon;
    const addonComponent = <Addon key="button" color={color} {...addon} />;

    const inputGroupContent =
      position === 'left' ? [addonComponent, input] : [input, addonComponent];

    content = <InputGroup>{inputGroupContent}</InputGroup>;
  }

  return (
    <FormGroup className={className} color={color}>
      {'label' in props && props.label ? (
        <Label for={props.id}>{props.label}</Label>
      ) : null}
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
