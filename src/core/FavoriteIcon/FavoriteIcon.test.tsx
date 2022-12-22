import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { FavoriteIcon } from './FavoriteIcon';
import { Color } from '../types';
import userEvent from '@testing-library/user-event';

describe('Component: FavoriteIcon', () => {
  function setup({
    value,
    color,
    hoverColor,
    activeColor,
    size
  }: {
    value: boolean;
    color?: Color;
    hoverColor?: Color;
    activeColor?: Color;
    size?: number;
  }) {
    const onChangeSpy = vi.fn();

    const { container } = render(
      <FavoriteIcon
        onChange={onChangeSpy}
        value={value}
        color={color}
        hoverColor={hoverColor}
        size={size}
        activeColor={activeColor}
      />
    );

    return { container, onChangeSpy };
  }

  describe('ui', () => {
    test('favorite', async () => {
      expect.assertions(2);

      const { container } = setup({ value: true });

      await screen.findByText('star');
      expect(screen.queryByText('star_border')).toBeNull();
      expect(container).toMatchSnapshot();
    });

    test('not favorite', async () => {
      expect.assertions(2);

      const { container } = setup({ value: false });

      expect(screen.queryByText('star')).toBeNull();
      await screen.queryByText('star_border');
      expect(container).toMatchSnapshot();
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

    test('active color', () => {
      const { container } = setup({
        value: true,
        color: 'primary',
        activeColor: 'success'
      });

      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('text-success')).toBe(
        true
      );
    });

    describe('hoverColor', () => {
      it('should use hoverColor when hoverColor is defined', async () => {
        expect.assertions(1);

        const { container } = setup({
          value: true,
          color: 'secondary',
          hoverColor: 'success'
        });

        await userEvent.hover(screen.getByText('star'));

        // @ts-expect-error HTMLElement has property classList
        expect(container.firstChild.classList.contains('text-success')).toBe(
          true
        );
      });

      it('should use activeColor when hoverColor is not defined', async () => {
        expect.assertions(1);

        const { container } = setup({ value: true });

        await userEvent.hover(screen.getByText('star'));

        // @ts-expect-error HTMLElement has property classList
        expect(container.firstChild.classList.contains('text-primary')).toBe(
          true
        );
      });
    });
  });

  describe('events', () => {
    it('should when value is false and the icon is clicked call onChange with true', () => {
      const { onChangeSpy } = setup({ value: false });

      fireEvent.click(screen.getByText('star_border'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should when value is true and the icon is clicked call onChange with false', () => {
      const { onChangeSpy } = setup({ value: true });

      fireEvent.click(screen.getByText('star'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(false);
    });
  });
});
