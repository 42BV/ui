import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Toggle } from './Toggle';
import { Tooltip } from '../Tooltip/Tooltip';
import userEvent from '@testing-library/user-event';

describe('Component: Toggle', () => {
  function setup({
    value,
    label = 'Test',
    hasLabel
  }: {
    value?: boolean;
    label?: React.ReactNode;
    hasLabel?: boolean;
  }) {
    const onChangeSpy = vi.fn();
    const onBlurSpy = vi.fn();

    const props = {
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      id: hasLabel ? 'toggle' : undefined,
      label,
      hiddenLabel: !hasLabel
    };

    const { container, rerender } = render(
      <Toggle {...props} color="primary" />
    );

    return { container, rerender, onChangeSpy, onBlurSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('checked', () => {
      setup({ value: true });
      // @ts-expect-error Checkbox has property checked
      expect(screen.getByRole('checkbox').checked).toEqual(true);
    });

    test('with text label', async () => {
      expect.assertions(1);
      const { container } = setup({ value: false, hasLabel: true });
      await screen.findByText('Test');
      await screen.findByLabelText('Test');
      expect(container).toMatchSnapshot();
    });

    test('with custom label', () => {
      const label = <Tooltip content="Is this a test?">test</Tooltip>;
      const { container } = setup({ value: false, label });
      expect(container).toMatchSnapshot();
    });
  });

  describe('events', () => {
    describe('onChange', () => {
      it('should call onChange with true when unchecked', async () => {
        expect.assertions(2);
        const { onChangeSpy } = setup({ value: false });

        // @ts-expect-error Checkbox has property checked
        expect(screen.getByRole('checkbox').checked).toEqual(false);

        await userEvent.click(screen.getByRole('checkbox'));

        await waitFor(() => {
          expect(
            getComputedStyle(screen.getByRole('checkbox'), '::after').left
          ).toBe('1rem');
        });
        expect(screen.getByRole('checkbox').checked).toEqual(true);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(true);
      });

      it('should call onChange with false when checked', () => {
        const { onChangeSpy } = setup({ value: true });

        // @ts-expect-error Checkbox has property checked
        expect(screen.getByRole('checkbox').checked).toEqual(true);

        fireEvent.click(screen.getByRole('checkbox'));

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(false);
      });
    });

    test('onBlur', () => {
      const { onBlurSpy } = setup({});

      fireEvent.blur(screen.getByRole('checkbox'));

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onChange when label is clicked', () => {
      const { onChangeSpy } = setup({ hasLabel: true });

      fireEvent.click(screen.getByText('Test'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(true);
    });
  });

  test('value changes', () => {
    const onChange = vi.fn();

    const { rerender } = render(
      <Toggle
        id="toggle"
        label="toggle"
        color="primary"
        value={false}
        onChange={onChange}
      />
    );

    // @ts-expect-error Checkbox has property checked
    expect(screen.getByRole('checkbox').checked).toEqual(false);

    rerender(
      <Toggle
        id="toggle"
        label="toggle"
        color="primary"
        value={true}
        onChange={onChange}
      />
    );

    // @ts-expect-error Checkbox has property checked
    expect(screen.getByRole('checkbox').checked).toEqual(true);
  });
});
