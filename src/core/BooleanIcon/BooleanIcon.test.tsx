import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { BooleanIcon } from './BooleanIcon';
import { Color } from '../types';
import userEvent from '@testing-library/user-event';

describe('Component: BooleanIcon', () => {
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
      <BooleanIcon
        value={value}
        size={size}
        color={color}
        hoverColor={hoverColor}
        onChange={hasOnChangeSpy ? onChangeSpy : undefined}
      />
    );

    return { container, onChangeSpy };
  }

  describe('ui', () => {
    test('value true', async () => {
      expect.assertions(2);

      const { container } = setup({ value: true });

      expect(container).toMatchSnapshot();
      await screen.findByText('check_box');
      expect(screen.queryByText('check_box_outline_blank')).toBeNull();
    });

    test('value false', async () => {
      expect.assertions(2);

      const { container } = setup({ value: false });

      expect(container).toMatchSnapshot();
      expect(screen.queryByText('check_box')).toBeNull();
      await screen.findByText('check_box_outline_blank');
    });

    test('size', () => {
      const { container } = setup({ value: false, size: 10 });

      // @ts-expect-error Child node is an Element
      expect(getComputedStyle(container.firstChild).fontSize).toBe('10px');
    });

    test('color', () => {
      const { container } = setup({ value: false, color: 'secondary' });

      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('text-secondary')).toBe(
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

        await userEvent.hover(screen.getByText('check_box'));

        // @ts-expect-error HTMLElement has property classList
        expect(container.firstChild.classList.contains('text-success')).toBe(
          true
        );
      });

      it('should not use activeColor when onChange and hoverColor are not defined', () => {
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

      it('should use activeColor when hoverColor is not defined and onChange is defined', () => {
        const { container } = setup({ value: true, hasOnChangeSpy: true });

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

      fireEvent.click(screen.getByText('check_box_outline_blank'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
