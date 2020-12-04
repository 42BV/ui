import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import TextEditor from './TextEditor';

describe('Component: TextEditor', () => {
  let textEditor: ShallowWrapper;

  let onChangeSpy: jest.Mock;
  let onBlurSpy: jest.Mock;
  let onFocusSpy: jest.Mock;

  function setup({
    value,
    hasPlaceholder = true,
    hasLabel = true,
    hasModules = false,
    formats = undefined
  }: {
    value?: string;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
    hasModules?: boolean;
    formats?: string[];
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();
    onFocusSpy = jest.fn();

    const props = {
      placeholder: hasPlaceholder ? 'Please enter your first name' : undefined,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      onFocus: onFocusSpy,
      error: 'Some error',
      valid: true,
      modules: hasModules
        ? {
            toolbar: ['bold']
          }
        : undefined,
      formats
    };

    if (hasLabel) {
      textEditor = shallow(
        <TextEditor
          id="firstName"
          label="First name"
          color="success"
          {...props}
        />
      );
    } else {
      textEditor = shallow(<TextEditor color="success" {...props} />);
    }
  }

  describe('ui', () => {
    test('with value', () => {
      setup({ value: 'Maarten' });

      expect(toJson(textEditor)).toMatchSnapshot(
        'Component: textEditor => ui => with value'
      );
    });

    test('without placeholder', () => {
      setup({ value: 'Maarten', hasPlaceholder: false });

      expect(toJson(textEditor)).toMatchSnapshot(
        'Component: textEditor => ui => without placeholder'
      );
    });

    test('without label', () => {
      setup({ value: 'Maarten', hasLabel: false });

      expect(toJson(textEditor)).toMatchSnapshot(
        'Component: textEditor => ui => without label'
      );
    });

    test('with modules', () => {
      setup({ value: 'Maarten', hasLabel: false, hasModules: true });

      expect(toJson(textEditor)).toMatchSnapshot(
        'Component: textEditor => ui => with modules'
      );
    });

    test('with formats', () => {
      setup({ value: 'Maarten', hasLabel: false, formats: ['italic'] });

      expect(toJson(textEditor)).toMatchSnapshot(
        'Component: textEditor => ui => with formats'
      );
    });
  });

  describe('events', () => {
    test('onChange', () => {
      setup({ value: undefined });

      const quill = textEditor.find('Quill');

      // @ts-expect-error Test mock
      quill.props().onChange('Maarten');

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('Maarten');
    });

    test('onBlur', () => {
      setup({ value: undefined });

      const quill = textEditor.find('Quill');

      // @ts-expect-error Test mock
      quill.props().onBlur();

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    test('onFocus', () => {
      setup({ value: undefined });

      const quill = textEditor.find('Quill');

      // @ts-expect-error Test mock
      quill.props().onFocus();

      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      setup({ value: 'Maarten' });

      let quill = textEditor.find('Quill');
      expect(quill.props().value).toBe('Maarten');

      textEditor.setProps({ value: undefined });

      quill = textEditor.find('Quill');
      expect(quill.props().value).toBe(undefined);
    });

    test('becomes filled', () => {
      setup({ value: undefined });

      let quill = textEditor.find('Quill');
      expect(quill.props().value).toBe(undefined);

      textEditor.setProps({ value: 'Maarten' });

      quill = textEditor.find('Quill');
      expect(quill.props().value).toBe('Maarten');
    });
  });
});
