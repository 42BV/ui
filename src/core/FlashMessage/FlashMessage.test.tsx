import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { FlashMessage } from './FlashMessage';

describe('Component: FlashMessage', () => {
  describe('ui', () => {
    test('normal', () => {
      const { container } = render(
        <FlashMessage color="danger">Danger commander</FlashMessage>
      );

      expect(container).toMatchSnapshot();
    });

    test('with extra css class', () => {
      const { container } = render(
        <FlashMessage className="extra-css-class" color="danger">
          Danger commander
        </FlashMessage>
      );

      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('extra-css-class')).toBe(
        true
      );
    });
  });

  test('onClose', () => {
    const onCloseSpy = vi.fn();

    render(<FlashMessage onClose={onCloseSpy}>Warning commander</FlashMessage>);

    fireEvent.click(screen.getByLabelText('Close'));

    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });
});
