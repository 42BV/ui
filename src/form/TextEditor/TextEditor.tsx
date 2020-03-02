import React from 'react';
import { FormGroup, Label } from 'reactstrap';
import ReactQuill from 'react-quill';
import classNames from 'classnames';

import withJarb from '../withJarb/withJarb';
import { doBlur } from '../utils';
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
  label: React.ReactNode;
}

export type Props = WithoutLabel | WithLabel;

/**
 * Textarea is a form element which allows the user to enter large
 * formatted text.
 *
 * Disclaimer: when using the TextEditor you must sanitize the output
 * when rendering the output in the browser. If you do not do this you
 * risk an XSS attack.
 *
 * The 42 way of dealing with this problem is by using jsoup and to use the
 * sanitiser, https://jsoup.org/cookbook/cleaning-html/whitelist-sanitizer,
 * with a whitelist. The whitelist should only contain elements which the
 * TextEditor generates. The sanitizer should be applied before sending
 * the content to the browser.
 */
export default function TextEditor(props: Props) {
  const {
    id,
    placeholder,
    onChange,
    onBlur,
    onFocus,
    valid,
    error,
    color,
    value,
    className = ''
  } = props;

  const inputProps = {
    id,
    placeholder,
    //@ts-ignore
    onChange: content => onChange(content),
    onBlur: () => doBlur(onBlur),
    onFocus,
    value
  };

  const classes = classNames({ 'is-invalid': valid === false });

  return (
    <FormGroup className={className} color={color}>
      {'label' in props && props.label ? (
        <Label for={props.id}>{props.label}</Label>
      ) : null}
      <ReactQuill className={classes} {...inputProps} />
      {error}
    </FormGroup>
  );
}

/**
 * Variant of the TextEditor which can be used in a Jarb context.
 */
export const JarbTextEditor = withJarb<string, string, Props>(TextEditor);
