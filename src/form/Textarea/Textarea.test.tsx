import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();
    const onFocusSpy = jest.fn();

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
      expect(screen.getByRole('textbox')).toHaveValue('Maarten');
    });

    test('with placeholder', () => {
      setup({ hasPlaceholder: true });
      expect(
        screen.queryByPlaceholderText('Please enter your first name')
      ).toBeInTheDocument();
    });

    test('without placeholder', () => {
      setup({ hasPlaceholder: false });
      expect(
        screen.queryByPlaceholderText('Please enter your first name')
      ).not.toBeInTheDocument();
    });

    test('visible label', () => {
      setup({ hasLabel: true });
      expect(screen.queryByText('First name')).toBeInTheDocument();
      expect(screen.queryByLabelText('First name')).toBeInTheDocument();
    });

    test('invisible label', () => {
      setup({ hasLabel: false });
      expect(screen.queryByText('First name')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('First name')).toBeInTheDocument();
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

      expect(screen.getByRole('textbox')).toHaveValue('Maarten');

      const newProps = {
        ...props,
        value: ''
      };

      rerender(<Textarea {...newProps} />);

      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    test('becomes filled', () => {
      const { props, rerender } = setup({ value: undefined });

      expect(screen.getByRole('textbox')).toHaveValue('');

      const newProps = {
        ...props,
        value: 'Maarten'
      };

      rerender(<Textarea {...newProps} />);

      expect(screen.getByRole('textbox')).toHaveValue('Maarten');
    });
  });
});
