import React, { Component } from 'react';
import { get } from 'lodash';
import { FieldValidator } from 'final-form';

import { FormGroup, Input, InputGroup, Label } from 'reactstrap';

import withJarb from '../withJarb/withJarb';
import { doBlur } from '../utils';
import { Color } from '../types';
import { Translation } from '../../utilities/translation/translator';
import Addon from '../Input/Addon/Addon';

interface BaseProps {
  /**
   * The placeholder of the form element.
   */
  placeholder?: string;

  /**
   * Which types of files the form element accepts.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
   */
  accept: string;

  /**
   * The value that the form element currently has.
   */
  value?: File;

  /**
   * Callback for when the form element changes.
   */
  onChange: (file: File | null) => void;

  /**
   * Optional callback for when the form element is blurred.
   */
  onBlur?: () => void;

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

export default class FileInput extends Component<Props> {
  inputRef = React.createRef<HTMLInputElement>();

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    /* istanbul ignore else */
    if (files) {
      const file = files.item(0);

      this.props.onChange(file);

      doBlur(this.props.onBlur);
    }
  }

  onClick(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    // The 'delete' button is clicked in this case.
    if (this.props.value) {
      event.preventDefault();

      this.props.onChange(null);
      doBlur(this.props.onBlur);

      /* istanbul ignore else */
      if (this.inputRef.current) {
        this.inputRef.current.value = '';
      }
    }

    // The input should now trigger the browsers file dialog
  }

  render() {
    const {
      accept,
      placeholder,
      error,
      color,
      value,
      valid,
      className = '',
      ...props
    } = this.props;

    const name = get(value, 'name', '');
    const inputProps = {
      placeholder,
      value: name,
      invalid: valid === false ? true : undefined
    };

    return (
      <FormGroup className={`file-upload ${className}`} color={color}>
        {'label' in props && props.label ? (
          <Label for={props.id}>{props.label}</Label>
        ) : null}
        <input
          id={'id' in props ? props.id : undefined}
          accept={accept}
          ref={this.inputRef}
          type="file"
          onClick={(event) => this.onClick(event)}
          onChange={(event) => this.onChange(event)}
        />

        <InputGroup>
          <Input {...inputProps} onChange={() => undefined} />
          <Addon
            icon={value ? 'delete' : 'cloud_upload'}
            position="right"
            color={value || valid === false ? 'danger' : 'primary'}
          />
        </InputGroup>

        {error}
      </FormGroup>
    );
  }
}

/**
 * Variant of the FileInput which can be used in a Jarb context.
 */
export const JarbFileInput = withJarb<File, File | null, Props>(FileInput);

/**
 * A FileValidator is a FieldValidator which checks if the `File`
 * is valid.
 */
type FileValidator = FieldValidator<File>;

/**
 * Takes a `label` and returns a validator which can check if the
 * there is a `File`.
 *
 * @export
 * @param {string} label The label to display in the error message
 * @returns {(FieldValidator<File>)}
 */
export function requireFile(label: string): FileValidator {
  return (value: File | null | undefined): Translation | undefined => {
    if (value) {
      return undefined;
    }

    return {
      key: 'FileInput.REQUIRED',
      data: { label },
      fallback: `${label} is required`
    };
  };
}

/**
 * Takes a `size` and `label` and returns a validator which can check if the
 * file is past the size limit.
 *
 * @export
 * @param {string} size The maximum size of the file in MB.
 * @param {string} label The label to display in the error message
 * @returns {(FieldValidator<File | null | undefined>)}
 */
export function limitFileSize(size: number, label: string): FileValidator {
  return (value: File | null | undefined): Translation | undefined => {
    if (!(value instanceof File)) {
      return undefined;
    }

    // Older browsers will not support this so we skip the check.
    /* istanbul ignore if */
    if (value.size === undefined) {
      return undefined;
    }

    const maxSizeInBytes = size * 1048576;

    if (value.size < maxSizeInBytes) {
      return undefined;
    }

    const fileSize = (value.size / 1048576).toFixed(1);
    const maxSizeDisplay = size.toFixed(1);

    return {
      key: 'FileInput.SIZE_TOO_LARGE',
      data: { label, size: maxSizeDisplay, fileSize },
      fallback: `${label} file is to large. Max size is ${maxSizeDisplay} MB file size is ${fileSize} MB`
    };
  };
}
