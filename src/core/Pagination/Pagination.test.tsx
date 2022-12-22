import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Page } from '@42.nl/spring-connect';

import { pagesFor, Pagination } from './Pagination';
import userEvent from '@testing-library/user-event';

describe('Component: Pagination', () => {
  function setup({
    number = 1,
    totalPages = 10,
    totalElements = 100,
    size = 10,
    showPreviousAndNextButtons,
    hasPageSizeDropdown,
    allowedPageSizes
  }: {
    number?: number;
    totalPages?: number;
    totalElements?: number;
    size?: number;
    showPreviousAndNextButtons?: boolean;
    hasPageSizeDropdown?: boolean;
    allowedPageSizes?: number[];
  }) {
    const page: Page<any> = {
      content: [],
      last: number === totalPages,
      totalElements,
      totalPages,
      size,
      number,
      first: number === 1,
      numberOfElements: 10
    };

    const onChangeSpy = vi.fn();
    const pageSizeChangeSpy = vi.fn();

    const props = {
      page,
      onChange: onChangeSpy,
      showPreviousAndNextButtons,
      onPageSizeChange: hasPageSizeDropdown ? pageSizeChangeSpy : undefined,
      allowedPageSizes
    };

    const { container } = render(<Pagination {...props} />);

    return { container, onChangeSpy, pageSizeChangeSpy };
  }

  describe('ui', () => {
    test('empty', () => {
      const { container } = setup({ totalPages: 1 });
      expect(container.firstChild).toBeNull();
    });

    test('first page', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('middle', () => {
      const { container } = setup({ number: 5 });
      expect(container).toMatchSnapshot();
    });

    test('last page', () => {
      const { container } = setup({ number: 10 });
      expect(container).toMatchSnapshot();
    });

    test('with page size dropdown', async () => {
      expect.assertions(0);
      setup({ hasPageSizeDropdown: true });
      await screen.findByRole('combobox');
    });

    test('without page size dropdown', () => {
      setup({ hasPageSizeDropdown: false });
      expect(screen.queryByRole('combobox')).toBeNull();
    });

    test('with custom allowed page sizes', async () => {
      expect.assertions(3);
      setup({ hasPageSizeDropdown: true, size: 3, allowedPageSizes: [3, 6] });
      expect(screen.queryAllByRole('option').length).toBe(2);
      await screen.findByRole('option', { name: '3' });
      await screen.findByRole('option', { name: '6' });
      expect(screen.queryByRole('option', { name: '5' })).toBeNull();
      expect(screen.queryByRole('option', { name: '10' })).toBeNull();
    });

    test('without previous and next buttons', () => {
      setup({ number: 1, totalPages: 10, showPreviousAndNextButtons: false });
      expect(screen.queryByText('arrow_back')).toBeNull();
      expect(screen.queryByText('arrow_forward')).toBeNull();
    });

    test('with previous and next buttons', async () => {
      expect.assertions(0);
      setup({ number: 5, totalPages: 10 });
      await screen.findByText('arrow_back');
      await screen.findByText('arrow_forward');
    });

    it('should disable the previous button when on the first page', () => {
      setup({ number: 1, totalPages: 3 });
      expect(
        screen
          .getByText('arrow_back')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.parentNode?.classList.contains('disabled')
      ).toBe(true);
    });

    it('should disable the next button when on the last page', () => {
      setup({ number: 3, totalPages: 3 });
      expect(
        screen
          .getByText('arrow_forward')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.parentNode?.classList.contains('disabled')
      ).toBe(true);
    });

    it('should return null when onPageSizeChange is defined but the total number of elements does not exceed the minimum page size', () => {
      const { container } = setup({
        hasPageSizeDropdown: true,
        totalElements: 5,
        totalPages: 1
      });
      expect(container.firstChild).toBeNull();
    });
  });

  describe('events', () => {
    it('should call onChange when pagination links are clicked', () => {
      const { onChangeSpy } = setup({
        number: 5,
        totalPages: 10,
        showPreviousAndNextButtons: false
      });

      fireEvent.click(screen.getByText('1'));

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

      fireEvent.click(screen.getByText('10'));

      expect(onChangeSpy).toHaveBeenCalledTimes(5);
      expect(onChangeSpy).toHaveBeenCalledWith(10);
    });

    describe('previous and next buttons', () => {
      it('should have previous and next buttons which move the page forward or backwards', () => {
        const { onChangeSpy } = setup({ number: 2, totalPages: 3 });

        fireEvent.click(screen.getByText('arrow_back'));

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(1);

        fireEvent.click(screen.getByText('arrow_forward'));

        expect(onChangeSpy).toHaveBeenCalledTimes(2);
        expect(onChangeSpy).toHaveBeenCalledWith(3);
      });
    });

    it('should call onPageSizeChange when page size dropdown is changed', async () => {
      expect.assertions(2);
      const { pageSizeChangeSpy } = setup({ hasPageSizeDropdown: true });
      await userEvent.selectOptions(screen.getByRole('combobox'), '100');
      expect(pageSizeChangeSpy).toHaveBeenCalledTimes(1);
      expect(pageSizeChangeSpy).toHaveBeenCalledWith(100);
    });
  });
});

describe('pages', () => {
  test('exact middle', () => {
    expect(pagesFor(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10]);
  });

  test('almost middle', () => {
    expect(pagesFor(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10]);
    expect(pagesFor(6, 10)).toEqual([1, '...', 5, 6, 7, '...', 10]);
  });

  test('absolute left', () => {
    expect(pagesFor(1, 10)).toEqual([1, 2, 3, '...', 8, 9, 10]);
  });

  test('almost left', () => {
    expect(pagesFor(2, 10)).toEqual([1, 2, 3, '...', 8, 9, 10]);
    expect(pagesFor(3, 10)).toEqual([1, 2, 3, 4, '...', 9, 10]);
    expect(pagesFor(4, 10)).toEqual([1, 2, 3, 4, 5, '...', 10]);
  });

  test('almost right', () => {
    expect(pagesFor(7, 10)).toEqual([1, '...', 6, 7, 8, 9, 10]);
    expect(pagesFor(8, 10)).toEqual([1, 2, '...', 7, 8, 9, 10]);
    expect(pagesFor(9, 10)).toEqual([1, 2, 3, '...', 8, 9, 10]);
  });

  test('absolute right', () => {
    expect(pagesFor(10, 10)).toEqual([1, 2, 3, '...', 8, 9, 10]);
  });

  test('shortage', () => {
    expect(pagesFor(1, 3)).toEqual([1, 2, 3]);
    expect(pagesFor(3, 3)).toEqual([1, 2, 3]);
    expect(pagesFor(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(pagesFor(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(pagesFor(7, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(pagesFor(1, 8)).toEqual([1, 2, 3, '...', 6, 7, 8]);
    expect(pagesFor(8, 8)).toEqual([1, 2, 3, '...', 6, 7, 8]);
  });
});
