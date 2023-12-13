import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Page } from '@42.nl/spring-connect';

import { EpicPagination, pagesFor } from './EpicPagination';

describe('Component: EpicPagination', () => {
  function setup({
    number = 1,
    totalPages = 10,
    totalElements = 100,
    size = 10,
    showPreviousAndNextButtons,
    showTotalElements,
    hasPageSizeDropdown,
    allowedPageSizes
  }: {
    number?: number;
    totalPages?: number;
    totalElements?: number;
    size?: number;
    showPreviousAndNextButtons?: boolean;
    showTotalElements?: boolean;
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

    const onChangeSpy = jest.fn();
    const pageSizeChangeSpy = jest.fn();

    const props = {
      page,
      onChange: onChangeSpy,
      showPreviousAndNextButtons,
      showTotalElements,
      onPageSizeChange: hasPageSizeDropdown ? pageSizeChangeSpy : undefined,
      allowedPageSizes
    };

    const { container } = render(<EpicPagination {...props} />);

    return { container, onChangeSpy, pageSizeChangeSpy };
  }

  describe('ui', () => {
    test('empty', () => {
      const { container } = setup({ totalPages: 1 });

      expect(container.firstChild).toBeNull();
    });

    test('middle', () => {
      const { container } = setup({ number: 5 });
      expect(container).toMatchSnapshot();
      expect(screen.queryByText('1')).not.toBeInTheDocument();
      expect(screen.queryByText('3')).toBeInTheDocument();
      expect(screen.getByText('5').parentNode).toHaveClass('active');
      expect(screen.queryByText('7')).toBeInTheDocument();
      expect(screen.queryByText('10')).not.toBeInTheDocument();
      expect(
        screen.getByText('first_page').parentNode?.parentNode
      ).not.toHaveClass('disabled');
      expect(
        screen.getByText('last_page').parentNode?.parentNode
      ).not.toHaveClass('disabled');
      expect(
        screen.getByText('chevron_left').parentNode?.parentNode
      ).not.toHaveClass('disabled');
      expect(
        screen.getByText('chevron_right').parentNode?.parentNode
      ).not.toHaveClass('disabled');
    });

    test('first page', () => {
      setup({ number: 1, totalPages: 10 });
      expect(screen.queryByText('1')).toBeInTheDocument();
      expect(screen.getByText('1').parentNode).toHaveClass('active');
      expect(screen.queryByText('3')).toBeInTheDocument();
      expect(screen.queryByText('4')).not.toBeInTheDocument();
      expect(screen.getByText('first_page').parentNode?.parentNode).toHaveClass(
        'disabled'
      );
      expect(
        screen.getByText('chevron_left').parentNode?.parentNode
      ).toHaveClass('disabled');
    });

    test('last page', () => {
      setup({ number: 10, totalPages: 10 });
      expect(screen.queryByText('10')).toBeInTheDocument();
      expect(screen.getByText('10').parentNode).toHaveClass('active');
      expect(screen.queryByText('8')).toBeInTheDocument();
      expect(screen.queryByText('7')).not.toBeInTheDocument();
      expect(screen.getByText('last_page').parentNode?.parentNode).toHaveClass(
        'disabled'
      );
      expect(
        screen.getByText('chevron_right').parentNode?.parentNode
      ).toHaveClass('disabled');
    });

    test('with page size dropdown', () => {
      setup({ hasPageSizeDropdown: true });
      expect(screen.queryByRole('combobox')).toBeInTheDocument();
    });

    test('without page size dropdown', () => {
      setup({ hasPageSizeDropdown: false });
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    test('with total elements', () => {
      setup({ totalElements: 20, showTotalElements: true });
      expect(screen.queryByText('20 records found')).toBeInTheDocument();
    });

    test('without total elements', () => {
      setup({ totalElements: 20, showTotalElements: false });
      expect(screen.queryByText('20 records found')).not.toBeInTheDocument();
    });

    test('with custom allowed page sizes', () => {
      setup({ hasPageSizeDropdown: true, size: 3, allowedPageSizes: [3, 6] });
      expect(screen.queryAllByRole('option').length).toBe(2);
      expect(
        screen.queryByRole('option', { name: '3 items per page' })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('option', { name: '6 items per page' })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('option', { name: '5 items per page' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('option', { name: '10 items per page' })
      ).not.toBeInTheDocument();
    });

    test('without previous and next buttons', () => {
      setup({ number: 1, totalPages: 10, showPreviousAndNextButtons: false });
      expect(screen.queryByText('first_page')).not.toBeInTheDocument();
      expect(screen.queryByText('chevron_left')).not.toBeInTheDocument();
      expect(screen.queryByText('chevron_right')).not.toBeInTheDocument();
      expect(screen.queryByText('last_page')).not.toBeInTheDocument();
    });

    test('with previous and next buttons', () => {
      setup({ number: 5, totalPages: 10 });
      expect(screen.queryByText('first_page')).toBeInTheDocument();
      expect(screen.queryByText('chevron_left')).toBeInTheDocument();
      expect(screen.queryByText('chevron_right')).toBeInTheDocument();
      expect(screen.queryByText('last_page')).toBeInTheDocument();
    });

    it('should disable the previous button when on the first page', () => {
      setup({ number: 1, totalPages: 3 });
      expect(screen.getByText('first_page').parentNode?.parentNode).toHaveClass(
        'disabled'
      );
      expect(
        screen.getByText('chevron_left').parentNode?.parentNode
      ).toHaveClass('disabled');
    });

    it('should disable the next button when on the last page', () => {
      setup({ number: 3, totalPages: 3 });
      expect(
        screen.getByText('chevron_right').parentNode?.parentNode
      ).toHaveClass('disabled');
      expect(screen.getByText('last_page').parentNode?.parentNode).toHaveClass(
        'disabled'
      );
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

  describe('large numbers', () => {
    it('should decrease font size when page number over 1000', () => {
      setup({ number: 1002, totalPages: 100000 });
      expect(screen.getByText('1002')).toHaveClass('scale-to-page-size-1000');
    });

    it('should decrease font size even more when page number over 10000', () => {
      setup({ number: 10002, totalPages: 100000 });
      expect(screen.getByText('10002')).toHaveClass('scale-to-page-size-10000');
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

    it('should call onPageSizeChange when page size dropdown is changed', async () => {
      expect.assertions(2);
      const { pageSizeChangeSpy } = setup({ hasPageSizeDropdown: true });
      await userEvent.selectOptions(
        screen.getByRole('combobox'),
        '100 items per page'
      );
      expect(pageSizeChangeSpy).toHaveBeenCalledTimes(1);
      expect(pageSizeChangeSpy).toHaveBeenCalledWith(100);
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
