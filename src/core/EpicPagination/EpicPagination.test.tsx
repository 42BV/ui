import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Page } from '@42.nl/spring-connect';

import Pagination, { pagesFor } from './EpicPagination';

describe('Component: Pagination', () => {
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

    const { container } = render(<Pagination {...props} />);

    return { container, onChangeSpy };
  }

  describe('ui', () => {
    test('empty', () => {
      const { container } = setup({ number: 1, totalPages: 1 });

      expect(container.firstChild).toBeNull();
    });

    test('middle', async () => {
      expect.assertions(8);
      const { container } = setup({ number: 5, totalPages: 10 });
      expect(container).toMatchSnapshot();
      expect(screen.queryByText('1')).toBeNull();
      await screen.findByText('3');
      expect(
        // @ts-expect-error HTMLElement has property classList
        screen.getByText('5').parentNode?.classList.contains('active')
      ).toBe(true);
      await screen.findByText('7');
      expect(screen.queryByText('10')).toBeNull();
      expect(
        screen
          .getByText('first_page')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.classList.contains('disabled')
      ).toBe(false);
      expect(
        // @ts-expect-error HTMLElement has property classList
        screen.getByText('last_page').parentNode?.classList.contains('disabled')
      ).toBe(false);
      expect(
        screen
          .getByText('chevron_left')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.classList.contains('disabled')
      ).toBe(false);
      expect(
        screen
          .getByText('chevron_right')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.classList.contains('disabled')
      ).toBe(false);
    });

    test('first page', async () => {
      expect.assertions(4);
      setup({ number: 1, totalPages: 10 });
      await screen.findByText('1');
      expect(
        // @ts-expect-error HTMLElement has property classList
        screen.getByText('1').parentNode?.classList.contains('active')
      ).toBe(true);
      await screen.findByText('3');
      expect(screen.queryByText('4')).toBeNull();
      expect(
        screen
          .getByText('first_page')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.parentNode?.classList.contains('disabled')
      ).toBe(true);
      expect(
        screen
          .getByText('chevron_left')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.parentNode?.classList.contains('disabled')
      ).toBe(true);
    });

    test('last page', async () => {
      expect.assertions(4);
      setup({ number: 10, totalPages: 10 });
      await screen.findByText('10');
      expect(
        // @ts-expect-error HTMLElement has property classList
        screen.getByText('10').parentNode?.classList.contains('active')
      ).toBe(true);
      await screen.findByText('8');
      expect(screen.queryByText('7')).toBeNull();
      expect(
        screen
          .getByText('last_page')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.parentNode?.classList.contains('disabled')
      ).toBe(true);
      expect(
        screen
          .getByText('chevron_right')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.parentNode?.classList.contains('disabled')
      ).toBe(true);
    });
  });

  describe('large numbers', () => {
    it('should decrease font size when page number over 1000', () => {
      setup({ number: 1002, totalPages: 100000 });
      expect(
        screen.getByText('1002').classList.contains('scale-to-page-size-1000')
      ).toBe(true);
    });

    it('should decrease font size even more when page number over 10000', () => {
      setup({ number: 10002, totalPages: 100000 });
      expect(
        screen.getByText('10002').classList.contains('scale-to-page-size-10000')
      ).toBe(true);
    });
  });

  describe('events', () => {
    it('should call onChange when pagination links are clicked', () => {
      const { onChangeSpy } = setup({ number: 5, totalPages: 10 });

      fireEvent.click(screen.getByText('first_page'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(1);

      fireEvent.click(screen.getByText('4'));

      expect(onChangeSpy).toHaveBeenCalledTimes(2);
      expect(onChangeSpy).toHaveBeenCalledWith(4);

      fireEvent.click(screen.getByText('5'));

      expect(onChangeSpy).toHaveBeenCalledTimes(3);
      expect(onChangeSpy).toHaveBeenCalledWith(5);

      fireEvent.click(screen.getByText('6'));

      expect(onChangeSpy).toHaveBeenCalledTimes(4);
      expect(onChangeSpy).toHaveBeenCalledWith(6);

      fireEvent.click(screen.getByText('last_page'));

      expect(onChangeSpy).toHaveBeenCalledTimes(5);
      expect(onChangeSpy).toHaveBeenCalledWith(10);
    });

    describe('previous and next buttons', () => {
      it('should have previous and next buttons which move the page forward or backwards', () => {
        const { onChangeSpy } = setup({ number: 2, totalPages: 3 });

        fireEvent.click(screen.getByText('chevron_left'));

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(1);

        fireEvent.click(screen.getByText('chevron_right'));

        expect(onChangeSpy).toHaveBeenCalledTimes(2);
        expect(onChangeSpy).toHaveBeenCalledWith(3);
      });
    });
  });
});

describe('pages', () => {
  test('exact middle', () => {
    expect(pagesFor(5, 10)).toEqual([3, 4, 5, 6, 7]);
  });

  test('almost middle', () => {
    expect(pagesFor(4, 10)).toEqual([2, 3, 4, 5, 6]);
    expect(pagesFor(6, 10)).toEqual([4, 5, 6, 7, 8]);
  });

  test('absolute left', () => {
    expect(pagesFor(1, 10)).toEqual(['...', '...', 1, 2, 3]);
  });

  test('almost left', () => {
    expect(pagesFor(2, 10)).toEqual(['...', 1, 2, 3, 4]);
    expect(pagesFor(3, 10)).toEqual([1, 2, 3, 4, 5]);
    expect(pagesFor(4, 10)).toEqual([2, 3, 4, 5, 6]);
  });

  test('almost right', () => {
    expect(pagesFor(7, 10)).toEqual([5, 6, 7, 8, 9]);
    expect(pagesFor(8, 10)).toEqual([6, 7, 8, 9, 10]);
    expect(pagesFor(9, 10)).toEqual([7, 8, 9, 10, '...']);
  });

  test('absolute right', () => {
    expect(pagesFor(10, 10)).toEqual([8, 9, 10, '...', '...']);
  });

  test('shortage', () => {
    expect(pagesFor(1, 3)).toEqual(['...', '...', 1, 2, 3]);
    expect(pagesFor(3, 3)).toEqual([1, 2, 3, '...', '...']);
  });
});
