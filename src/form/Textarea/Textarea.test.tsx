import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import Textarea from './Textarea';

describe('Component: Textarea', () => {
  let textarea: ShallowWrapper;

  let onChangeSpy: jest.Mock<any, any>;
  let onBlurSpy: jest.Mock<any, any>;
  let onFocusSpy: jest.Mock<any, any>;

  function setup({ value }: { value?: string }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();
    onFocusSpy = jest.fn();

    textarea = shallow(
      <Textarea
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

    expect(toJson(textarea)).toMatchSnapshot('Component: textarea => ui');
  });

  describe('events', () => {
    test('onChange', () => {
      setup({ value: undefined });

      const textareaAutosize = textarea.find('TextareaAutosize');

      //@ts-ignore
      textareaAutosize.props().onChange({ target: { value: 'Maarten' } });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('Maarten');
    });

    test('onBlur', () => {
      setup({ value: undefined });

      const textareaAutosize = textarea.find('TextareaAutosize');

      //@ts-ignore
      textareaAutosize.props().onBlur();

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    test('onFocus', () => {
      setup({ value: undefined });

      const textareaAutosize = textarea.find('TextareaAutosize');

      //@ts-ignore
      textareaAutosize.props().onFocus();

      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      setup({ value: 'Maarten' });

      let textareaAutosize = textarea.find('TextareaAutosize');
      expect(textareaAutosize.props().value).toBe('Maarten');

      textarea.setProps({ value: undefined });

      textareaAutosize = textarea.find('TextareaAutosize');
      expect(textareaAutosize.props().value).toBe(undefined);
    });

    test('becomes filled', () => {
      setup({ value: undefined });

      let textareaAutosize = textarea.find('TextareaAutosize');
      expect(textareaAutosize.props().value).toBe(undefined);

      textarea.setProps({ value: 'Maarten' });

      textareaAutosize = textarea.find('TextareaAutosize');
      expect(textareaAutosize.props().value).toBe('Maarten');
    });
  });
});
