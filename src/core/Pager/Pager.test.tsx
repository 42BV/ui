import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Page } from '@42.nl/spring-connect';

import { Pager } from './Pager';

describe('Component: Pager', () => {
  function setup({
    number,
    totalPages
  }: {
    number: number;
    totalPages: number;
  }) {
    const page: Page<any> = {
      content: [],
      last: number === totalPages,
      totalElements: 100,
      totalPages,
      size: 10,
      number,
      first: number === 1,
      numberOfElements: 10
    };

    const onChangeSpy = vi.fn();

    const props = {
      page,
      onChange: onChangeSpy
    };

    const { container } = render(<Pager {...props} />);

    return { container, onChangeSpy };
  }

  describe('ui', () => {
    test('empty', () => {
      const { container } = setup({ number: 1, totalPages: 1 });
      expect(container.firstChild).toBeNull();
    });

    test('normal', () => {
      const { container } = setup({ number: 5, totalPages: 10 });
      expect(container).toMatchSnapshot();
    });

    test('first', () => {
      setup({ number: 1, totalPages: 10 });
      expect(
        // @ts-expect-error HTMLElement has property disabled
        screen.getByText('arrow_back').parentNode?.parentNode?.disabled
      ).toEqual(true);
    });

    test('last', () => {
      setup({ number: 10, totalPages: 10 });
      expect(
        // @ts-expect-error HTMLElement has property disabled
        screen.getByText('arrow_forward').parentNode?.parentNode?.disabled
      ).toEqual(true);
    });
  });

  describe('events', () => {
    it('should call onChange when previous or next button is clicked', () => {
      const { onChangeSpy } = setup({ number: 5, totalPages: 10 });

      const buttons = screen.getAllByRole('button');

      fireEvent.click(buttons[0]);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(4);

      fireEvent.click(buttons[1]);

      expect(onChangeSpy).toHaveBeenCalledTimes(2);
      expect(onChangeSpy).toHaveBeenCalledWith(6);
    });
  });
});
