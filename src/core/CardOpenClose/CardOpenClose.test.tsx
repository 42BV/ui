import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { CardOpenClose } from './CardOpenClose';

describe('Component: CardOpenClose', () => {
  function setup({ isOpen }: { isOpen: boolean }) {
    const toggleSpy = vi.fn();

    const { container } = render(
      <CardOpenClose header="click this" isOpen={isOpen} toggle={toggleSpy}>
        {() => <p>This is collapsable content</p>}
      </CardOpenClose>
    );

    return { container, toggleSpy };
  }

  describe('ui', () => {
    test('open', async () => {
      expect.assertions(2);
      const { container } = setup({ isOpen: true });
      expect(container).toMatchSnapshot();
      await screen.findByText('This is collapsable content');
      expect(
        screen.getByText('expand_more').classList.contains('is-open')
      ).toBe(true);
    });

    test('closed', () => {
      setup({ isOpen: false });
      expect(screen.queryByText('This is collapsable content')).toBeNull();
      expect(
        screen.getByText('expand_more').classList.contains('is-closed')
      ).toBe(true);
    });
  });

  describe('events', () => {
    it('should call toggle when the header is clicked', () => {
      const { toggleSpy } = setup({ isOpen: false });

      fireEvent.click(screen.getByText('click this'));

      expect(toggleSpy).toHaveBeenCalledTimes(1);
    });
  });
});
