import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { InputGroupText } from 'reactstrap';

import { Input, InputMask, InputType, reactStrapInput } from './Input';

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
    addonPosition,
    valid,
    hasPlaceholder,
    hasLabel
  }: {
    value?: string;
    type?: InputType;
    mask?: InputMask;
    addon?: React.ReactElement;
    addonPosition?: 'left' | 'right';
    valid?: boolean;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
  }) {
    const onChangeSpy = vi.fn();
    const onBlurSpy = vi.fn();
    const onFocusSpy = vi.fn();

    const props = {
      name: 'firstName',
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
      addonPosition,
      id: hasLabel ? 'firstName' : undefined,
      label: 'First name',
      hiddenLabel: !hasLabel
    };

    const { container, rerender, asFragment } = render(
      <Input color="success" {...props} />
    );

    return {
      container,
      props,
      asFragment,
      rerender,
      onChangeSpy,
      onBlurSpy,
      onFocusSpy
    };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('type email', () => {
      setup({ type: 'email' });
      expect(screen.getByRole('textbox').getAttribute('type')).toBe('email');
    });

    test('with placeholder', async () => {
      expect.assertions(0);
      setup({ hasPlaceholder: true });
      await screen.findByPlaceholderText('Please enter your first name');
    });

    test('without placeholder', () => {
      setup({ hasPlaceholder: false });
      expect(
        screen.queryByPlaceholderText('Please enter your first name')
      ).toBeNull();
    });

    test('visible label', async () => {
      expect.assertions(1);
      const { container } = setup({ hasLabel: true });
      await screen.findByText('First name');
      await screen.findByLabelText('First name');
      expect(container).toMatchSnapshot();
    });

    test('invisible label', async () => {
      expect.assertions(1);
      setup({ hasLabel: false });
      expect(screen.queryByText('First name')).toBeNull();
      await screen.findByLabelText('First name');
    });

    test('addon default', () => {
      const { container } = setup({
        addon: <InputGroupText>Default on the left</InputGroupText>
      });
      expect(container).toMatchSnapshot();
    });

    test('addon left', () => {
      setup({
        addon: <InputGroupText>Left</InputGroupText>,
        addonPosition: 'left'
      });
      const addon = screen.getByText('Left');
      expect(addon.parentNode?.childNodes.item(0)).toBe(addon);
    });

    test('addon right', () => {
      setup({
        addon: <InputGroupText position="right">Right</InputGroupText>,
        addonPosition: 'right'
      });
      const addon = screen.getByText('Right');
      expect(addon.parentNode?.childNodes.item(1)).toBe(addon);
    });

    test('is valid', () => {
      setup({ valid: true });
      expect(screen.getByRole('textbox').classList.contains('is-valid')).toBe(
        true
      );
    });

    test('is invalid', () => {
      setup({ valid: false });
      expect(screen.getByRole('textbox').classList.contains('is-invalid')).toBe(
        true
      );
    });
  });

  test('masked', () => {
    const { container } = setup({ mask });
    expect(container).toMatchSnapshot();
  });

  describe('events', () => {
    test('onChange', () => {
      const { onChangeSpy } = setup({ value: undefined, type: 'text' });

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'Maarten' }
      });

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

      // @ts-expect-error Form elements have property value
      expect(screen.getByRole('textbox').value).toEqual('Maarten');

      const newProps = {
        ...props,
        value: ''
      };

      rerender(<Input color="success" {...newProps} />);

      // @ts-expect-error Form elements have property value
      expect(screen.getByRole('textbox').value).toEqual('');
    });

    test('becomes filled', () => {
      const { props, rerender } = setup({ value: '', type: 'text' });

      // @ts-expect-error Form elements have property value
      expect(screen.getByRole('textbox').value).toEqual('');

      const newProps = {
        ...props,
        value: 'Maarten'
      };

      rerender(<Input color="success" {...newProps} />);

      // @ts-expect-error Form elements have property value
      expect(screen.getByRole('textbox').value).toEqual('Maarten');
    });
  });
});

test('reactStrapInput', () => {
  const { container } = render(reactStrapInput(vi.fn(), { id: 10 }));
  expect(container).toMatchSnapshot();
});
