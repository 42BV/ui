import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { SuccessIcon } from './SuccessIcon';
import { BootstrapColor } from '../types';
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
    color?: BootstrapColor;
    hoverColor?: BootstrapColor;
    size?: number;
    hasOnChangeSpy?: boolean;
  }) {
    const onChangeSpy = jest.fn();

    const { container } = render(
      <SuccessIcon
        value={value}
        color={color}
        hoverColor={hoverColor}
        size={size}
        // @ts-expect-error mocks
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
      expect(container.firstChild).toHaveTextContent('clear');
    });

    test('size', () => {
      const { container } = setup({ value: false, size: 10 });
      expect(container.firstChild).toHaveStyle({ fontSize: 10 });
    });

    test('color', () => {
      const { container } = setup({ value: false, color: 'primary' });
      expect(container.firstChild).toHaveClass('text-primary');
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

        await userEvent.hover(screen.getByText('done'));

        expect(container.firstChild).toHaveClass('text-success');
      });

      it('should not use activeColor when onChange and hoverColor are not defined', async () => {
        expect.assertions(1);

        const { container } = setup({
          value: true,
          color: 'secondary',
          hasOnChangeSpy: false
        });

        await userEvent.hover(screen.getByText('done'));

        expect(container.firstChild).toHaveClass('text-secondary');
      });

      it('should use activeColor when hoverColor is not defined and onChange is defined', async () => {
        expect.assertions(1);

        const { container } = setup({ value: true, hasOnChangeSpy: true });

        await userEvent.hover(screen.getByText('done'));

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

      fireEvent.click(screen.getByText('clear'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
