import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Input, { InputMask, InputType, reactStrapInput } from './Input';

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
  function setup({
    value,
    type,
    mask,
    addon,
    valid,
    hasPlaceholder,
    hasLabel
  }: {
    value?: string;
    type?: InputType;
    mask?: InputMask;
    addon?: React.ReactElement;
    valid?: boolean;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();
    const onFocusSpy = jest.fn();

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
      addon,
      id: hasLabel ? 'firstName' : undefined,
      label: hasLabel ? 'First name' : undefined
    };

    const { container, rerender, asFragment } = render(
      <Input color="success" {...props} />
    );

    return { container, props, asFragment, rerender, onChangeSpy, onBlurSpy, onFocusSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('type email', () => {
      setup({ type: 'email' });
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    test('with placeholder', () => {
      setup({ hasPlaceholder: true });
      expect(screen.queryByPlaceholderText('Please enter your first name')).toBeInTheDocument();
    });

    test('without placeholder', () => {
      setup({ hasPlaceholder: false });
      expect(screen.queryByPlaceholderText('Please enter your first name')).not.toBeInTheDocument();
    });

    test('with label', () => {
      const { container } = setup({ hasLabel: true });
      expect(screen.queryByText('First name')).toBeInTheDocument();
      expect(screen.queryByLabelText('First name')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });

    test('without label', () => {
      setup({ hasLabel: false });
      expect(screen.queryByText('First name')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('First name')).not.toBeInTheDocument();
    });

    test('addon default', () => {
      const { container } = setup({ addon: <Addon>Default on the left</Addon> });
      expect(container).toMatchSnapshot();
    });

    test('addon left', () => {
      setup({ addon: <Addon position="left"><span>Left</span></Addon> });
      const addon = screen.getByText('Left');
      expect(addon.parentNode?.childNodes.item(0)).toBe(addon);
    });

    test('addon right', () => {
      setup({ addon: <Addon position="right"><span>Right</span></Addon> });
      const addon = screen.getByText('Right');
      expect(addon.parentNode?.childNodes.item(1)).toBe(addon);
    });

    test('is valid', () => {
      setup({ valid: true });
      expect(screen.getByRole('textbox')).toHaveClass('is-valid');
    });

    test('is invalid', () => {
      setup({ valid: false });
      expect(screen.getByRole('textbox')).toHaveClass('is-invalid');
    });
  });

  test('masked', () => {
    const { container } = setup({ mask });
    expect(container).toMatchSnapshot();
  });

  describe('events', () => {
    test('onChange', () => {
      const { onChangeSpy } = setup({ value: undefined, type: 'text' });

      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Maarten' } });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('Maarten');
    });

    test('onBlur', () => {
      const { onBlurSpy } = setup({ value: undefined, type: 'text' });

      fireEvent.blur(screen.getByRole('textbox'));

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    test('onFocus', () => {
      const { onFocusSpy } = setup({ value: undefined, type: 'text' });

      fireEvent.focus(screen.getByRole('textbox'));

      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      const { props, rerender } = setup({ value: 'Maarten', type: 'text' });

      expect(screen.getByRole('textbox')).toHaveValue('Maarten');

      const newProps = {
        ...props,
        value: ''
      };

      rerender(
        <Input color="success" {...newProps} />
      );

      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    test('becomes filled', () => {
      const { props, rerender } = setup({ value: '', type: 'text' });

      expect(screen.getByRole('textbox')).toHaveValue('');

      const newProps = {
        ...props,
        value: 'Maarten'
      };

      rerender(
        <Input color="success" {...newProps} />
      );

      expect(screen.getByRole('textbox')).toHaveValue('Maarten');
    });
  });
});

test('reactStrapInput', () => {
  const { container } = render(reactStrapInput(jest.fn(), { id: 10 }));
  expect(container).toMatchSnapshot();
});
