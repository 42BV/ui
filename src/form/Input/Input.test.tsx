import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import Input, { reactStrapInput, InputMask, InputType } from './Input';

import { Addon } from '../addons/Addon/Addon';

const mask: InputMask = [
  '(',
  /[1-9]/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/
];

describe('Component: Input', () => {
  let input: ShallowWrapper;

  let onChangeSpy: jest.Mock;
  let onBlurSpy: jest.Mock;
  let onFocusSpy: jest.Mock;

  function setup({
    value,
    type,
    mask,
    addon,
    valid,
    hasPlaceholder = true,
    hasLabel = true
  }: {
    value?: string;
    type?: InputType;
    mask?: InputMask;
    addon?: React.ReactElement;
    valid?: boolean;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();
    onFocusSpy = jest.fn();

    const props = {
      name: "firstName",
      placeholder: hasPlaceholder ? 'Please enter your first name' : undefined,
      type,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      onFocus: onFocusSpy,
      error: 'Some error',
      valid,
      mask,
      addon
    };

    if (hasLabel) {
      input = shallow(
        <Input id="firstName" label="First name" color="success" {...props} />
      );
    } else {
      input = shallow(<Input color="success" {...props} />);
    }
  }

  describe('ui', () => {
    test('type email', () => {
      setup({ value: 'Maarten', type: 'email' });

      expect(toJson(input)).toMatchSnapshot(
        'Component: Input => ui => type email'
      );
    });

    test('defaults to text', () => {
      setup({ value: 'Maarten', type: undefined });

      expect(toJson(input)).toMatchSnapshot(
        'Component: Input => ui => defaults to text'
      );
    });

    test('with mask', () => {
      setup({ value: 'Maarten', mask });

      expect(toJson(input)).toMatchSnapshot(
        'Component: Input => ui => with mask'
      );
    });

    test('without placeholder', () => {
      setup({ value: 'Maarten', hasPlaceholder: false });

      expect(toJson(input)).toMatchSnapshot(
        'Component: Input => ui => without placeholder'
      );
    });

    test('without label', () => {
      setup({ value: 'Maarten', hasLabel: false });

      expect(toJson(input)).toMatchSnapshot(
        'Component: Input => ui => without label'
      );
    });

    test('addon default', () => {
      setup({ addon: <Addon>Default on the left</Addon> });

      expect(toJson(input)).toMatchSnapshot(
        'Component: Input => addon position default'
      );
    });

    test('addon left', () => {
      setup({ addon: <Addon position="left">Left</Addon> });

      expect(toJson(input)).toMatchSnapshot(
        'Component: Input => addon position left'
      );
    });

    test('addon right', () => {
      setup({ addon: <Addon position="right">Right</Addon> });

      expect(toJson(input)).toMatchSnapshot(
        'Component: Input => addon position right'
      );
    });

    test('is valid', () => {
      setup({ valid: true });

      expect(toJson(input)).toMatchSnapshot('Component: Input => is valid');
    });

    test('is invalid', () => {
      setup({ valid: false });

      expect(toJson(input)).toMatchSnapshot('Component: Input => is invalid');
    });
  });

  describe('events', () => {
    test('onChange', () => {
      setup({ value: undefined, type: 'text' });

      const rsInput = input.find('Input');

      // @ts-expect-error Test mock
      rsInput.props().onChange({ target: { value: 'Maarten' } });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('Maarten');
    });

    test('onBlur', () => {
      setup({ value: undefined, type: 'text' });

      const rsInput = input.find('Input');

      // @ts-expect-error Test mock
      rsInput.props().onBlur();

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    test('onFocus', () => {
      setup({ value: undefined, type: 'text' });

      const rsInput = input.find('Input');

      // @ts-expect-error Test mock
      rsInput.props().onFocus();

      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      setup({ value: 'Maarten', type: 'text' });

      let rsInput = input.find('Input');
      expect(rsInput.props().value).toBe('Maarten');

      input.setProps({ value: undefined });

      rsInput = input.find('Input');
      expect(rsInput.props().value).toBe(undefined);
    });

    test('becomes filled', () => {
      setup({ value: undefined, type: 'text' });

      let rsInput = input.find('Input');
      expect(rsInput.props().value).toBe(undefined);

      input.setProps({ value: 'Maarten' });

      rsInput = input.find('Input');
      expect(rsInput.props().value).toBe('Maarten');
    });
  });
});

test('reactStrapInput', () => {
  const input = shallow(reactStrapInput(jest.fn(), { id: 10 }));

  expect(toJson(input)).toMatchSnapshot('reactStrapInput');
});
