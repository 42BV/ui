import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import Input, { reactStrapInput } from './Input';
import { Mask, Position } from './types';

import { InputType } from 'reactstrap/lib/Input';
import IconType from '../../core/Icon/types';

const mask: Mask = [
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
    position,
    valid,
    hasPlaceholder = true,
    hasLabel = true
  }: {
    value?: string;
    type?: InputType;
    mask?: Mask;
    position?: Position;
    valid?: boolean;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();
    onFocusSpy = jest.fn();

    const icon: IconType = '3d_rotation';
    const addon = position !== undefined ? { icon, position } : undefined;

    const props = {
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

    test('position left', () => {
      setup({ position: 'left' });

      expect(toJson(input)).toMatchSnapshot(
        'Component: Input => position left'
      );
    });

    test('position right', () => {
      setup({ position: 'right' });

      expect(toJson(input)).toMatchSnapshot(
        'Component: Input => position right'
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

      // @ts-ignore
      rsInput.props().onChange({ target: { value: 'Maarten' } });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('Maarten');
    });

    test('onBlur', () => {
      setup({ value: undefined, type: 'text' });

      const rsInput = input.find('Input');

      // @ts-ignore
      rsInput.props().onBlur();

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    test('onFocus', () => {
      setup({ value: undefined, type: 'text' });

      const rsInput = input.find('Input');

      // @ts-ignore
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
