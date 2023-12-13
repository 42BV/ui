import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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
    const onChangeSpy = jest.fn();

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
    test('favorite', () => {
      const { container } = setup({ value: true });

      expect(screen.queryByText('star')).toBeInTheDocument();
      expect(screen.queryByText('star_border')).not.toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });

    test('not favorite', () => {
      const { container } = setup({ value: false });

      expect(screen.queryByText('star')).not.toBeInTheDocument();
      expect(screen.queryByText('star_border')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });

    test('size', () => {
      const { container } = setup({ value: false, size: 10 });

      expect(container.firstChild).toHaveStyle({ fontSize: 10 });
    });

    test('color', () => {
      const { container } = setup({ value: false, color: 'primary' });

      expect(container.firstChild).toHaveClass('text-primary');
    });

    test('active color', () => {
      const { container } = setup({
        value: true,
        color: 'primary',
        activeColor: 'success'
      });

      expect(container.firstChild).toHaveClass('text-success');
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

        expect(container.firstChild).toHaveClass('text-success');
      });

      it('should use activeColor when hoverColor is not defined', async () => {
        expect.assertions(1);

        const { container } = setup({ value: true });

        await userEvent.hover(screen.getByText('star'));

        expect(container.firstChild).toHaveClass('text-primary');
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
