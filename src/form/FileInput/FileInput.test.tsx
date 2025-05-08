import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { FileInput, limitFileSize, requireFile } from './FileInput';

describe('Component: FileInput', () => {
  function setup({
    value,
    valid,
    hasPlaceholder = true,
    hasLabel = true
  }: {
    value?: File;
    valid?: boolean;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    const props = {
      placeholder: hasPlaceholder ? 'Upload a file here' : undefined,
      accept: 'text/plain',
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      valid,
      id: hasLabel ? 'file-upload-with-button' : undefined,
      label: 'Upload a file here',
      hiddenLabel: !hasLabel
    };

    const { container } = render(<FileInput color="success" {...props} />);

    return { container, onChangeSpy, onBlurSpy };
  }

  describe('ui', () => {
    test('with value', () => {
      const { container } = setup({
        value: new File([''], 'maarten.png'),
        valid: true
      });
      expect(container).toMatchSnapshot();
    });

    test('without value', () => {
      setup({ hasLabel: true });
      expect(screen.getByLabelText('Upload a file here')).not.toHaveValue();
    });

    test('without placeholder', () => {
      setup({ hasPlaceholder: false });
      expect(
        screen.queryByPlaceholderText('Upload a file here')
      ).not.toBeInTheDocument();
    });

    test('invisible label', () => {
      setup({ hasLabel: false });
      expect(screen.queryByText('Upload a file here')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Upload a file here')).toBeInTheDocument();
    });

    test('invalid', () => {
      setup({ valid: false });
      expect(screen.queryByPlaceholderText('Upload a file here')).toHaveClass(
        'is-invalid'
      );
    });

    test('valid', () => {
      setup({ valid: true });
      expect(
        screen.queryByPlaceholderText('Upload a file here')
      ).not.toHaveClass('is-invalid');
    });
  });

  test('should not be able to change placeholder input', () => {
    const console = global.console;
    const consoleErrorSpy = jest.fn();
    // @ts-expect-error We only use error, not all the other properties
    global.console = { error: consoleErrorSpy };

    setup({});

    fireEvent.change(screen.getByPlaceholderText('Upload a file here'), {
      target: { value: 'test' }
    });

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'The placeholder input of FileInput should not be changeable'
    );

    global.console = console;
  });

  describe('events', () => {
    test('onChange', () => {
      const { onChangeSpy, onBlurSpy } = setup({ value: undefined });

      const file = new File([''], 'maarten.png');

      fireEvent.change(screen.getByLabelText('Upload a file here'), {
        target: { files: { item: jest.fn().mockReturnValue(file) } }
      });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy.mock.calls[0][0].name).toBe('maarten.png');

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    describe('onClick', () => {
      test('with value', () => {
        const { onChangeSpy, onBlurSpy } = setup({
          value: new File([''], 'maarten.png')
        });

        fireEvent.click(screen.getByLabelText('Upload a file here'));

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(null);

        expect(onBlurSpy).toHaveBeenCalledTimes(1);

        expect(screen.getByLabelText('Upload a file here')).toHaveValue('');
      });

      test('without value', () => {
        const { onChangeSpy, onBlurSpy } = setup({ value: undefined });

        fireEvent.click(screen.getByLabelText('Upload a file here'));

        expect(onChangeSpy).toHaveBeenCalledTimes(0);
        expect(onBlurSpy).toHaveBeenCalledTimes(0);
      });

      it('should click the file input when the button is clicked', () => {
        const { onChangeSpy } = setup({
          value: new File([''], 'maarten.png')
        });

        fireEvent.click(screen.getByText('delete'));

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(null);
      });
    });
  });
});

test('requireFile', () => {
  const validator = requireFile('cv');

  // @ts-expect-error Even though it accepts File it will be given undefined and null
  expect(validator(undefined, {})).toEqual({
    data: { label: 'cv' },
    key: 'FileInput.REQUIRED',
    fallback: 'cv is required'
  });
  // @ts-expect-error Even though it accepts File it will be given undefined and null
  expect(validator(null, {})).toEqual({
    data: { label: 'cv' },
    key: 'FileInput.REQUIRED',
    fallback: 'cv is required'
  });

  expect(validator(new File([''], 'henkie.docx'), {})).toBe(undefined);
});

test('limitFileSize', () => {
  const validator = limitFileSize(1, 'cv');

  // @ts-expect-error Even though it accepts File it will be given undefined and null
  expect(validator(undefined, {})).toBe(undefined);

  // @ts-expect-error Even though it accepts File it will be given undefined and null
  expect(validator(null, {})).toBe(undefined);

  const smallFile = new File([''], 'small.docx');
  expect(validator(smallFile, {})).toBe(undefined);

  const largeFile = new File(['very long string'.repeat(100000)], 'large.docx');
  expect(validator(largeFile, {})).toEqual({
    data: { fileSize: '1.5', label: 'cv', size: '1.0' },
    fallback: 'cv file is to large. Max size is 1.0 MB file size is 1.5 MB',
    key: 'FileInput.SIZE_TOO_LARGE'
  });
});
