import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { AddonButton } from './AddonButton';
import { ButtonIconPosition } from '../../../core/Button/Button';
import { Color } from '../../../core/types';

describe('Component: AddonButton', () => {
  function setup({
    position,
    color,
    className
  }: {
    position?: ButtonIconPosition;
    color?: Color;
    className?: string;
  }) {
    const onClickSpy = jest.fn();

    const { container } = render(
      <AddonButton position={position} color={color} onClick={onClickSpy} className={className}>
        42
      </AddonButton>
    );

    return { container, onClickSpy };
  }

  test('ui', () => {
    const { container } = setup({});
    expect(container).toMatchSnapshot();
  });

  test('custom class', () => {
    const { container } = setup({ className: 'extra-class' });
    expect(container.firstChild).toHaveClass('extra-class');
  });

  describe('color behavior', () => {
    it('should show a primary button when color is empty', () => {
      setup({ color: undefined });
      expect(screen.getByText('42')).toHaveClass('btn-primary');
    });

    it('should show the color when property color is set', () => {
      setup({ color: 'danger' });
      expect(screen.getByText('42')).toHaveClass('btn-danger');
    });
  });

  it('should call onClick when the button is clicked', () => {
    const { onClickSpy } = setup({ color: 'danger' });

    fireEvent.click(screen.getByText('42'));

    expect(onClickSpy).toHaveBeenCalledTimes(1);
  });
});
