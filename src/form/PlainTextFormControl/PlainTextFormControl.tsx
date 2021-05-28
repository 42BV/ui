import { FormGroup, Label } from 'reactstrap';
import React from 'react';
import classNames from 'classnames';

type Props = {
  /**
   * Optionally the label of the form element.
   */
  label?: React.ReactNode;

  /**
   * The value that the form element currently has.
   */
  children: React.ReactNode;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optional extra CSS class you want to add to the value.
   * Useful for styling the value.
   */
  valueClassName?: string;

  /**
   * Optional extra CSS class you want to add to the label.
   * Useful for styling the label.
   */
  labelClassName?: string;
};

/**
 * Not all users know that an interaction design element can have
 * a disabled state. Disabled elements have poor contrast and thus
 * are not as readable as they should. Also, screen readers don't
 * give users as much information about the state of the element
 * and keyboard navigation gets a little weird, causing confusion to
 * those using a screen reader. Users might also think the form
 * element might be enabled by changing another form element or in
 * a different use case. So to prevent users confusion or thinking
 * the form is invalid, you should display the value without letting
 * it look like a form element. To prevent alignment issues, the
 * PlainTextFormControl uses spacing as if it were a form element,
 * without the looks of a form element.
 */
export function PlainTextFormControl({
  label,
  children,
  className,
  valueClassName,
  labelClassName
}: Props) {
  const valueClasses = classNames('form-control-plaintext', valueClassName);

  return (
    <FormGroup className={className}>
      {label ? <Label className={labelClassName}>{label}</Label> : null}
      <div className={valueClasses}>{children}</div>
    </FormGroup>
  );
}
