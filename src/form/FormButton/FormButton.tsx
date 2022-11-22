import React from 'react';
import { Button } from '../../core/Button/Button';
import { ButtonProps } from '../../core/types';

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

/**
 * The FormButton component is used to submit forms from a distance.
 * Distance meaning that the FormButton is not rendered inside a <form>.
 * Sometimes this happens when doing more advanced layouts.
 *
 * The FormButton will when clicked search for the <form> with the
 * `formId` prop and will submit that form.
 *
 * It is used when using the EpicForm component.
 */
export function FormButton({
  formId,
  type,
  ...rest
}: Props & Omit<ButtonProps<React.ReactNode>, 'type' | 'onClick'>) {
  function onClick() {
    document
      .getElementById(formId)
      ?.dispatchEvent(new Event(type, { cancelable: true, bubbles: true }));
  }

  const buttonProps = {
    type,
    onClick,
    ...rest
  } as ButtonProps<React.ReactNode>;

  return <Button {...buttonProps} />;
}
