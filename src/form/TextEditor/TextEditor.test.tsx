import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import Texteditor from './TextEditor';

describe('Component: TextEditor', () => {
  let textEditor: ShallowWrapper;

  let onChangeSpy: jest.Mock<any, any>;
  let onBlurSpy: jest.Mock<any, any>;
  let onFocusSpy: jest.Mock<any, any>;

  function setup({ value }: { value?: string }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();
    onFocusSpy = jest.fn();

    textEditor = shallow(
      <Texteditor
        id="firstName"
        label="First name"
        placeholder="Please enter your first name"
        value={value}
        onChange={onChangeSpy}
        onBlur={onBlurSpy}
        onFocus={onFocusSpy}
        error="Some error"
        color="success"
        valid={true}
      />
    );
  }

  test('ui', () => {
    setup({ value: 'Maarten' });

    expect(toJson(textEditor)).toMatchSnapshot('Component: textEditor => ui');
  });

  describe('events', () => {
    test('onChange', () => {
      setup({ value: undefined });

      const quill = textEditor.find('Quill');

      // @ts-ignore
      quill.props().onChange('Maarten');

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('Maarten');
    });

    test('onBlur', () => {
      setup({ value: undefined });

      const quill = textEditor.find('Quill');

      // @ts-ignore
      quill.props().onBlur();

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    test('onFocus', () => {
      setup({ value: undefined });

      const quill = textEditor.find('Quill');

      // @ts-ignore
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