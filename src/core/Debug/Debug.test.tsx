import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Debug } from './Debug';

describe('Component: Debug', () => {
  function setup({ defaultOpen }: { defaultOpen?: boolean }) {
    const { container } = render(
      <Debug value={{ property: 'test' }} defaultOpen={defaultOpen} />
    );
    return { container };
  }

  test('ui', () => {
    const { container } = setup({});

    expect(container).toMatchSnapshot();
  });

  it('should start closed when open is false', () => {
    setup({ defaultOpen: false });

    expect(
      screen.queryByText('{ "property": "test" }')
    ).not.toBeInTheDocument();
  });

  it('should start open when open is true', () => {
    setup({ defaultOpen: true });

    expect(screen.queryByText('{ "property": "test" }')).toBeInTheDocument();
  });

  it('should start open when open is undefined', () => {
    setup({});

    expect(screen.queryByText('{ "property": "test" }')).toBeInTheDocument();
  });

  describe('events', () => {
    it('should toggle isOpen', () => {
      const setIsOpenSpy = jest.fn();
      jest.spyOn(React, 'useState').mockReturnValue([true, setIsOpenSpy]);

      setup({});

      fireEvent.click(screen.getByText('expand_more'));

      expect(setIsOpenSpy).toHaveBeenCalledTimes(1);
      expect(setIsOpenSpy).toHaveBeenCalledWith(false);
    });
  });
});
