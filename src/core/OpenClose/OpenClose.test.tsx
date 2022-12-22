import React from 'react';
import { render } from '@testing-library/react';

import { OpenClose } from './OpenClose';

describe('Component: OpenClose', () => {
  function setup({
    isOpen = false,
    className
  }: {
    isOpen?: boolean;
    className?: string;
  }) {
    const { container } = render(
      <OpenClose open={isOpen} className={className} />
    );

    return { container };
  }

  describe('ui', () => {
    test('open', () => {
      const { container } = setup({ isOpen: true });
      expect(container).toMatchSnapshot();
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('is-open')).toBe(true);
    });

    test('closed', () => {
      const { container } = setup({ isOpen: false });
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('is-closed')).toBe(true);
    });

    test('extra class', () => {
      const { container } = setup({ isOpen: true, className: 'extra-class' });
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('extra-class')).toBe(true);
    });
  });
});
