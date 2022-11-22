import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { BooleanIcon } from './BooleanIcon';
import { BootstrapColor } from '../types';
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
    color?: BootstrapColor;
    hoverColor?: BootstrapColor;
    size?: number;
    hasOnChangeSpy?: boolean;
  }) {
    const onChangeSpy = jest.fn();

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
    test('value true', () => {
      const { container } = setup({ value: true });

      expect(container).toMatchSnapshot();
      expect(screen.queryByText('check_box')).toBeInTheDocument();
      expect(
        screen.queryByText('check_box_outline_blank')
      ).not.toBeInTheDocument();
    });

    test('value false', () => {
      const { container } = setup({ value: false });

      expect(container).toMatchSnapshot();
      expect(screen.queryByText('check_box')).not.toBeInTheDocument();
      expect(screen.queryByText('check_box_outline_blank')).toBeInTheDocument();
    });

    test('size', () => {
      const { container } = setup({ value: false, size: 10 });

      expect(container.firstChild).toHaveStyle({ fontSize: 10 });
    });

    test('color', () => {
      const { container } = setup({ value: false, color: 'secondary' });

      expect(container.firstChild).toHaveClass('text-secondary');
    });

    describe('activeColor', () => {
      it('should not use activeColor when value is true if onChange is not defined', () => {
        const { container } = setup({
          value: true,
          color: 'secondary',
          hasOnChangeSpy: false
        });

        expect(container.firstChild).toHaveClass('text-secondary');
      });

      it('should use activeColor when value is true if onChange is defined', () => {
        const { container } = setup({ value: true, hasOnChangeSpy: true });

        expect(container.firstChild).toHaveClass('text-primary');
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

        expect(container.firstChild).toHaveClass('text-success');
      });

      it('should not use activeColor when onChange and hoverColor are not defined', () => {
        const { container } = setup({
          value: true,
          color: 'secondary',
          hasOnChangeSpy: false
        });

        expect(container.firstChild).toHaveClass('text-secondary');
      });

      it('should use activeColor when hoverColor is not defined and onChange is defined', () => {
        const { container } = setup({ value: true, hasOnChangeSpy: true });

        expect(container.firstChild).toHaveClass('text-primary');
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
