import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { TextButton } from './TextButton';

describe('component: TextButton', () => {
  function setup({ className }: { className?: string }) {
    const onClickSpy = vi.fn();
    const { container } = render(
      <TextButton onClick={onClickSpy} className={className}>
        Clear
      </TextButton>
    );

    return { container, onClickSpy };
  }

  describe('ui', () => {
    test('standard', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with custom classname', () => {
      const { container } = setup({ className: 'yolo' });
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('yolo')).toBe(true);
    });
  });

  describe('events', () => {
    it('should when clicked call the onClick callback prop', () => {
      const { onClickSpy } = setup({});

      fireEvent.click(screen.getByRole('button'));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });
});
