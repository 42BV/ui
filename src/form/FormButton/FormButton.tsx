import React from 'react';
import Button, { Props as ButtonProps } from '../../core/Button/Button';

type Props = {
  /**
   * The id of the form that should be submitted or reset on click.
   */
  formId: string;

  /**
   * The type of button it is, defaults to 'button'.
   *
   * @default button
   */
  type: 'submit' | 'reset';
};

export function FormButton({
  formId,
  type,
  ...rest
}: Props & Omit<ButtonProps, 'type' | 'onClick'>) {
  function onClick() {
    document
      .getElementById(formId)
      ?.dispatchEvent(new Event(type, { cancelable: true }));
  }

  const buttonProps = { type, onClick, ...rest } as ButtonProps;

  return <Button {...buttonProps} />;
}
