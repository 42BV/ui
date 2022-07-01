import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { CardOpenClose } from './CardOpenClose';

describe('Component: CardOpenClose', () => {
  function setup({ isOpen }: { isOpen: boolean }) {
    const toggleSpy = jest.fn();

    const { container } = render(
      <CardOpenClose header="click this" isOpen={isOpen} toggle={toggleSpy}>
        {() => (
          <p>
            This is collapsable content that should not be included in the HTML
            when isOpen is false
          </p>
        )}
      </CardOpenClose>
    );

    return { container, toggleSpy };
  }

  describe('ui', () => {
    test('open', () => {
      const { container } = setup({ isOpen: true });

      expect(container).toMatchSnapshot();
    });

    test('closed', () => {
      const { container } = setup({ isOpen: false });

      expect(container).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should call toggle when the header is clicked', () => {
      const { toggleSpy } = setup({ isOpen: false });

      fireEvent.click(screen.getByText('click this'));

      expect(toggleSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deprecated: content', () => {
    function setup({ isOpen }: { isOpen: boolean }) {
      const { container } = render(
        <CardOpenClose
          header="click this"
          isOpen={isOpen}
          toggle={jest.fn()}
          content={() => (
            <p>
              This is collapsable content that should not be included in the
              HTML when isOpen is false
            </p>
          )}
        />
      );
      return { container };
    }

    test('open', () => {
      const { container } = setup({ isOpen: true });

      expect(container).toMatchSnapshot();
    });

    test('closed', () => {
      const { container } = setup({ isOpen: false });

      expect(container).toMatchSnapshot();
    });
  });
});
