import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { Textarea } from './Textarea';

describe('Component: Textarea', () => {
  function setup({
    value,
    hasPlaceholder,
    hasLabel
  }: {
    value?: string;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
  }) {
    const onChangeSpy = vi.fn();
    const onBlurSpy = vi.fn();
    const onFocusSpy = vi.fn();

    const props = {
      placeholder: hasPlaceholder ? 'Please enter your first name' : undefined,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      onFocus: onFocusSpy,
      error: 'Some error',
      valid: true,
      id: hasLabel ? 'firstName' : undefined,
      label: 'First name',
      hiddenLabel: !hasLabel
    };

    const { container, rerender } = render(
      <Textarea color="success" {...props} />
    );

    return { container, props, rerender, onChangeSpy, onBlurSpy, onFocusSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with value', () => {
      setup({ value: 'Maarten' });
      // @ts-expect-error Form elements have property value
      expect(screen.getByRole('textbox').value).toEqual('Maarten');
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
      expect.assertions(0);
      setup({ hasLabel: true });
      await screen.findByText('First name');
      await screen.findByLabelText('First name');
    });

    test('invisible label', async () => {
      expect.assertions(1);
      setup({ hasLabel: false });
      expect(screen.queryByText('First name')).toBeNull();
      await screen.queryByLabelText('First name');
    });
  });

  describe('events', () => {
    test('onChange', () => {
      const { onChangeSpy } = setup({ value: undefined });

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'Maarten' }
      });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('Maarten');
    });

    test('onBlur', () => {
      const { onBlurSpy } = setup({ value: undefined });

      fireEvent.blur(screen.getByRole('textbox'));

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    test('onFocus', () => {
      const { onFocusSpy } = setup({ value: undefined });

      fireEvent.focus(screen.getByRole('textbox'));

      expect(onFocusSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      const { props, rerender } = setup({ value: 'Maarten' });

      // @ts-expect-error Form elements have property value
      expect(screen.getByRole('textbox').value).toEqual('Maarten');

      const newProps = {
        ...props,
        value: ''
      };

      rerender(<Textarea {...newProps} />);

      // @ts-expect-error Form elements have property value
      expect(screen.getByRole('textbox').value).toEqual('');
    });

    test('becomes filled', () => {
      const { props, rerender } = setup({ value: undefined });

      // @ts-expect-error Form elements have property value
      expect(screen.getByRole('textbox').value).toEqual('');

      const newProps = {
        ...props,
        value: 'Maarten'
      };

      rerender(<Textarea {...newProps} />);

      // @ts-expect-error Form elements have property value
      expect(screen.getByRole('textbox').value).toEqual('Maarten');
    });
  });
});
