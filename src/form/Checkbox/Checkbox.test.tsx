import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Checkbox } from './Checkbox';

describe('Component: Checkbox', () => {
  function setup({
    value,
    hasPlaceholder,
    allowIndeterminate,
    hasLabel
  }: {
    value?: boolean;
    hasPlaceholder?: boolean;
    allowIndeterminate?: boolean;
    hasLabel?: boolean;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    const props = {
      id: hasLabel ? 'agree' : undefined,
      label: 'Agree',
      hiddenLabel: !hasLabel,
      placeholder: hasPlaceholder ? 'Do you agree' : undefined,
      value,
      valid: value === true,
      allowIndeterminate,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
    };

    const { container, rerender, asFragment } = render(
      <Checkbox {...props} />
    );

    return { container, rerender, asFragment, onBlurSpy, onChangeSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with placeholder', () => {
      setup({ hasPlaceholder: true });
      expect(screen.queryByText('Do you agree')).toBeInTheDocument();
    });

    test('without placeholder', () => {
      setup({ hasPlaceholder: false });
      expect(screen.queryByText('Do you agree')).not.toBeInTheDocument();
    });

    test('visible label', () => {
      setup({ hasLabel: true });
      expect(screen.queryByText('Agree')).toBeInTheDocument();
      expect(screen.queryByLabelText('Agree')).toBeInTheDocument();
    });

    test('invisible label', () => {
      setup({ hasLabel: false });
      expect(screen.queryByText('Agree')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Agree')).toBeInTheDocument();
    });
  });

  describe('allowIndeterminate is true', () => {
    it('should set indeterminate to false when value is true', () => {
      setup({ value: true, allowIndeterminate: true });
      expect(screen.getByRole('checkbox')).not.toBePartiallyChecked();
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('should set indeterminate to false when value is false', () => {
      setup({ value: false, allowIndeterminate: true });
      expect(screen.getByRole('checkbox')).not.toBePartiallyChecked();
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('should set indeterminate to true when value is undefined', () => {
      setup({ value: undefined, allowIndeterminate: true });
      expect(screen.getByRole('checkbox')).toBePartiallyChecked();
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
  });

  describe('events', () => {
    test('onChange', () => {
      const { onBlurSpy, onChangeSpy } = setup({ value: true });

      fireEvent.click(screen.getByLabelText('Agree'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(false);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      const { rerender, onBlurSpy, onChangeSpy } = setup({ value: true });

      expect(screen.getByRole('checkbox')).toBeChecked();

      rerender(
        <Checkbox
          id="agree"
          label="Agree"
          value={undefined}
          valid={true}
          onChange={onChangeSpy}
          onBlur={onBlurSpy}
          error="Some error"
        />
      );

      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    test('becomes filled from false', () => {
      const { rerender, onChangeSpy, onBlurSpy } = setup({ value: false });

      expect(screen.getByRole('checkbox')).not.toBeChecked();

      rerender(
        <Checkbox
          id="agree"
          label="Agree"
          value={true}
          valid={true}
          onChange={onChangeSpy}
          onBlur={onBlurSpy}
          error="Some error"
        />
      );

      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    test('becomes filled from undefined', () => {
      const { rerender, onBlurSpy, onChangeSpy } = setup({ value: undefined });

      expect(screen.getByRole('checkbox')).not.toBeChecked();

      rerender(
        <Checkbox
          id="agree"
          label="Agree"
          value={true}
          valid={true}
          onChange={onChangeSpy}
          onBlur={onBlurSpy}
          error="Some error"
        />
      );

      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });
});
