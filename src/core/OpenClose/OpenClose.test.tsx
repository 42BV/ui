import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { OpenClose } from './OpenClose';

describe('Component: OpenClose', () => {
  function setup({ isOpen = false, className }: { isOpen?: boolean; className?: string; }) {
    const { container } = render(
      <OpenClose open={isOpen} className={className} />
    );

    return { container };
  }

  describe('ui', () => {
    test('open', () => {
      const { container } = setup({ isOpen: true });
      expect(container).toMatchSnapshot();
      expect(container.firstChild).toHaveClass('is-open');
    });

    test('closed', () => {
      const { container } = setup({ isOpen: false });
      expect(container.firstChild).toHaveClass('is-closed');
    });

    test('extra class', () => {
      const { container } = setup({ isOpen: true, className: 'extra-class' });
      expect(container.firstChild).toHaveClass('extra-class');
    });
  });
});
