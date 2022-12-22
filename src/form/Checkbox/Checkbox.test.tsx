import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

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
    const onChangeSpy = vi.fn();
    const onBlurSpy = vi.fn();

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
      error: 'Some error'
    };

    const { container, rerender, asFragment } = render(<Checkbox {...props} />);

    return { container, rerender, asFragment, onBlurSpy, onChangeSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with placeholder', async () => {
      expect.assertions(0);
      setup({ hasPlaceholder: true });
      await screen.findByText('Do you agree');
    });

    test('without placeholder', () => {
      setup({ hasPlaceholder: false });
      expect(screen.queryByText('Do you agree')).toBeNull();
    });

    test('visible label', async () => {
      expect.assertions(1);
      setup({ hasLabel: true });
      expect.assertions(0);
      await screen.findByText('Agree');
      await screen.findByLabelText('Agree');
    });

    test('invisible label', async () => {
      expect.assertions(1);
      setup({ hasLabel: false });
      expect(screen.queryByText('Agree')).toBeNull();
      await screen.findByLabelText('Agree');
    });
  });

  describe('allowIndeterminate is true', () => {
    it('should set indeterminate to false when value is true', () => {
      setup({ value: true, allowIndeterminate: true });
      // @ts-expect-error Checkbox has property indeterminate
      expect(screen.getByRole('checkbox').indeterminate).toEqual(false);
      // @ts-expect-error Checkbox has property checked
      expect(screen.getByRole('checkbox').checked).toEqual(true);
    });

    it('should set indeterminate to false when value is false', () => {
      setup({ value: false, allowIndeterminate: true });
      // @ts-expect-error Checkbox has property indeterminate
      expect(screen.getByRole('checkbox').indeterminate).toEqual(false);
      // @ts-expect-error Checkbox has property checked
      expect(screen.getByRole('checkbox').checked).toEqual(false);
    });

    it('should set indeterminate to true when value is undefined', () => {
      setup({ value: undefined, allowIndeterminate: true });
      // @ts-expect-error Checkbox has property indeterminate
      expect(screen.getByRole('checkbox').indeterminate).toEqual(true);
      // @ts-expect-error Checkbox has property checked
      expect(screen.getByRole('checkbox').checked).toEqual(false);
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

      // @ts-expect-error Checkbox has property checked
      expect(screen.getByRole('checkbox').checked).toEqual(true);

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

      // @ts-expect-error Checkbox has property checked
      expect(screen.getByRole('checkbox').checked).toEqual(false);
    });

    test('becomes filled from false', () => {
      const { rerender, onChangeSpy, onBlurSpy } = setup({ value: false });

      // @ts-expect-error Checkbox has property checked
      expect(screen.getByRole('checkbox').checked).toEqual(false);

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

      // @ts-expect-error Checkbox has property checked
      expect(screen.getByRole('checkbox').checked).toEqual(true);
    });

    test('becomes filled from undefined', () => {
      const { rerender, onBlurSpy, onChangeSpy } = setup({ value: undefined });

      // @ts-expect-error Checkbox has property checked
      expect(screen.getByRole('checkbox').checked).toEqual(false);

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

      // @ts-expect-error Checkbox has property checked
      expect(screen.getByRole('checkbox').checked).toEqual(true);
    });
  });
});
