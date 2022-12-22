import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { SuccessIcon } from './SuccessIcon';
import { Color } from '../types';
import userEvent from '@testing-library/user-event';

describe('Component: SuccessIcon', () => {
  function setup({
    value,
    color,
    hoverColor,
    size,
    hasOnChangeSpy
  }: {
    value: boolean;
    color?: Color;
    hoverColor?: Color;
    size?: number;
    hasOnChangeSpy?: boolean;
  }) {
    const onChangeSpy = vi.fn();

    const { container } = render(
      <SuccessIcon
        value={value}
        color={color}
        hoverColor={hoverColor}
        size={size}
        onChange={hasOnChangeSpy ? onChangeSpy : undefined}
      />
    );

    return { container, onChangeSpy };
  }

  describe('ui', () => {
    test('value true', () => {
      const { container } = setup({ value: true });
      expect(container).toMatchSnapshot();
    });

    test('value false', () => {
      const { container } = setup({ value: false });
      expect(container.firstChild?.textContent).toEqual('clear');
    });

    test('size', () => {
      const { container } = setup({ value: false, size: 10 });
      // @ts-expect-error Child node is an Element
      expect(getComputedStyle(container.firstChild).fontSize).toBe('10px');
    });

    test('color', () => {
      const { container } = setup({ value: false, color: 'primary' });
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('text-primary')).toBe(
        true
      );
    });

    describe('activeColor', () => {
      it('should not use activeColor when value is true if onChange is not defined', () => {
        const { container } = setup({
          value: true,
          color: 'secondary',
          hasOnChangeSpy: false
        });

        // @ts-expect-error HTMLElement has property classList
        expect(container.firstChild.classList.contains('text-secondary')).toBe(
          true
        );
      });

      it('should use activeColor when value is true if onChange is defined', () => {
        const { container } = setup({ value: true, hasOnChangeSpy: true });

        // @ts-expect-error HTMLElement has property classList
        expect(container.firstChild.classList.contains('text-primary')).toBe(
          true
        );
      });
    });

    describe('hoverColor', () => {
      it('should use hoverColor when onChange and hoverColor are defined', async () => {
        expect.assertions(1);

        const { container } = setup({
          value: true,
          color: 'secondary',
          hoverColor: 'success',
          hasOnChangeSpy: true
        });

        await userEvent.hover(screen.getByText('done'));

        // @ts-expect-error HTMLElement has property classList
        expect(container.firstChild.classList.contains('text-success')).toBe(
          true
        );
      });

      it('should not use activeColor when onChange and hoverColor are not defined', async () => {
        expect.assertions(1);

        const { container } = setup({
          value: true,
          color: 'secondary',
          hasOnChangeSpy: false
        });

        await userEvent.hover(screen.getByText('done'));

        // @ts-expect-error HTMLElement has property classList
        expect(container.firstChild.classList.contains('text-secondary')).toBe(
          true
        );
      });

      it('should use activeColor when hoverColor is not defined and onChange is defined', async () => {
        expect.assertions(1);

        const { container } = setup({ value: true, hasOnChangeSpy: true });

        await userEvent.hover(screen.getByText('done'));

        // @ts-expect-error HTMLElement has property classList
        expect(container.firstChild.classList.contains('text-primary')).toBe(
          true
        );
      });
    });
  });

  describe('events', () => {
    it('should call onChange when clicked', () => {
      const { onChangeSpy } = setup({
        value: false,
        hasOnChangeSpy: true
      });

      fireEvent.click(screen.getByText('clear'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
