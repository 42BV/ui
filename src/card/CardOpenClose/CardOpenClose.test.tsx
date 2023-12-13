import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CardOpenClose } from './CardOpenClose';

describe('Component: CardOpenClose', () => {
  function setup({ isOpen }: { isOpen: boolean }) {
    const toggleSpy = jest.fn();

    const { container } = render(
      <CardOpenClose header="click this" isOpen={isOpen} toggle={toggleSpy}>
        {() => <p>This is collapsable content</p>}
      </CardOpenClose>
    );

    return { container, toggleSpy };
  }

  describe('ui', () => {
    test('open', () => {
      const { container } = setup({ isOpen: true });
      expect(container).toMatchSnapshot();
      expect(
        screen.queryByText('This is collapsable content')
      ).toBeInTheDocument();
      expect(screen.getByText('expand_more')).toHaveClass('is-open');
    });

    test('closed', () => {
      setup({ isOpen: false });
      expect(
        screen.queryByText('This is collapsable content')
      ).not.toBeInTheDocument();
      expect(screen.getByText('expand_more')).toHaveClass('is-closed');
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
