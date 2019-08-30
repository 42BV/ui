import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import FileInput, { requireFile, limitFileSize } from './FileInput';

describe('Component: FileInput', () => {
  let fileInput: ShallowWrapper;

  let onChangeSpy: jest.Mock<any, any>;
  let onBlurSpy: jest.Mock<any, any>;

  function setup({ value, valid }: { value?: File; valid?: boolean }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();

    fileInput = shallow(
      <FileInput
        id="file-upload-with-button"
        placeholder="Upload a file here"
        label="Upload a file here"
        accept="text/plain"
        value={value}
        onChange={onChangeSpy}
        onBlur={onBlurSpy}
        error="Some error"
        color="success"
        valid={valid}
      />
    );
  }

  describe('ui', () => {
    test('with value', () => {
      setup({ value: new File([''], 'maarten.png'), valid: true });

      fileInput.setState({ imageSrc: 'maarten.png' });

      expect(toJson(fileInput)).toMatchSnapshot(
        'Component: FileInput => ui => with value'
      );
    });

    test('empty value', () => {
      setup({ value: undefined, valid: false });

      expect(toJson(fileInput)).toMatchSnapshot(
        'Component: FileInput => ui => empty value'
      );
    });

    test('valid when file present but invalid', () => {
      setup({ value: new File([''], 'maarten.png'), valid: false });

      // @ts-ignore
      expect(fileInput.find('Input').props().valid).toBe(true);
    });
  });

  describe('events', () => {
    test('onChange', () => {
      setup({ value: undefined });

      const instance = fileInput.instance();
      jest.spyOn(instance, 'setState');

      const input = fileInput.find('input');

      const file = new File([''], 'maarten.png');

      // @ts-ignore
      input.props().onChange({ target: { files: { item: () => file } } });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy.mock.calls[0][0].name).toBe('maarten.png');

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    test('onChange of Input should do nothing', () => {
      setup({ value: undefined });

      // @ts-ignore
      fileInput
        .find('Input')
        .props()
        .onChange();

      // It should not call the onChangesSpy at all.
      expect(onChangeSpy).toHaveBeenCalledTimes(0);
    });

    describe('onClick', () => {
      test('with value', () => {
        setup({ value: new File([''], 'maarten.png') });

        const input = fileInput.find('input');

        // @ts-ignore
        fileInput.instance().inputRef = { current: { value: 'maarten.png' } };

        const eventDefaultSpy = jest.fn();
        // @ts-ignore
        input.props().onClick({ preventDefault: eventDefaultSpy });

        expect(eventDefaultSpy).toHaveBeenCalledTimes(1);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(null);

        expect(onBlurSpy).toHaveBeenCalledTimes(1);

        // @ts-ignore
        expect(fileInput.instance().inputRef.current.value).toBe('');
      });

      test('without value', () => {
        setup({ value: undefined });

        const input = fileInput.find('input');

        const eventDefaultSpy = jest.fn();
        // @ts-ignore
        input.props().onClick({ preventDefault: eventDefaultSpy });

        expect(eventDefaultSpy).toHaveBeenCalledTimes(0);
        expect(onChangeSpy).toHaveBeenCalledTimes(0);
        expect(onBlurSpy).toHaveBeenCalledTimes(0);
      });
    });
  });
});

test('requireFile', () => {
  const validator = requireFile('cv');

  expect(validator(undefined, {})).toEqual({
    data: { label: 'cv' },
    key: 'FileInput.REQUIRED',
    fallback: 'cv is required'
  });
  expect(validator(null, {})).toEqual({
    data: { label: 'cv' },
    key: 'FileInput.REQUIRED',
    fallback: 'cv is required'
  });

  expect(validator(new File([''], 'henkie.docx'), {})).toBe(undefined);
});

test('limitFileSize', () => {
  const validator = limitFileSize(1, 'cv');

  expect(validator(undefined, {})).toBe(undefined);
  expect(validator(null, {})).toBe(undefined);

  const smallFile = new File([''], 'small.docx');
  expect(validator(smallFile, {})).toBe(undefined);

  const largeFile = new File(['very long string'.repeat(100000)], 'large.docx');
  expect(validator(largeFile, {})).toEqual({
    data: { fileSize: '1.5', label: 'cv', size: '1.0' },
    fallback: 'cv file is to large. Max size is 1.0 MB file size is 1.5 MB',
    key: 'FileInput.SIZE_TO_LARGE'
  });
});
