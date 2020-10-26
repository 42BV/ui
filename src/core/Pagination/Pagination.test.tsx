import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Page } from '@42.nl/spring-connect';

import Pagination, { pagesFor } from './Pagination';
import { Icon } from '../Icon';

describe('Component: Pagination', () => {
  let pagination: ShallowWrapper;
  let onChangeSpy: jest.Mock;

  function setup({
    number,
    totalPages,
    showPreviousAndNextButtons
  }: {
    number: number;
    totalPages: number;
    showPreviousAndNextButtons?: boolean;
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

    onChangeSpy = jest.fn();

    const props = {
      page,
      onChange: onChangeSpy,
      showPreviousAndNextButtons
    };

    pagination = shallow(<Pagination {...props} />);
  }

  describe('ui', () => {
    test('empty', () => {
      setup({ number: 1, totalPages: 1 });

      expect(pagination.isEmptyRender()).toBe(true);
    });

    test('middle', () => {
      setup({ number: 5, totalPages: 10, showPreviousAndNextButtons: false });

      expect(toJson(pagination)).toMatchSnapshot(
        'Component: Pagination => ui => middle'
      );
    });

    test('no previous', () => {
      setup({ number: 1, totalPages: 10, showPreviousAndNextButtons: false });

      expect(toJson(pagination)).toMatchSnapshot(
        'Component: Pagination => ui => no previous'
      );
    });

    test('no next', () => {
      setup({ number: 10, totalPages: 10, showPreviousAndNextButtons: false });

      expect(toJson(pagination)).toMatchSnapshot(
        'Component: Pagination => ui => no next'
      );
    });

    test('with previous and next buttons', () => {
      setup({ number: 5, totalPages: 10, showPreviousAndNextButtons: true });

      const items = pagination.find('PaginationItem');

      const previousPaginationItem = items.at(0);
      const nextPaginationItem = items.at(8);

      expect(previousPaginationItem.props().disabled).toBe(false);
      expect(previousPaginationItem.find(Icon).props().icon).toBe('arrow_back');

      expect(nextPaginationItem.props().disabled).toBe(false);
      expect(nextPaginationItem.find(Icon).props().icon).toBe('arrow_forward');

      expect(toJson(pagination)).toMatchSnapshot(
        'Component: Pagination => ui => with previous and next buttons'
      );
    });

    it('should disable the previous button when on the first page', () => {
      setup({ number: 1, totalPages: 3, showPreviousAndNextButtons: true });

      const items = pagination.find('PaginationItem');

      // Prev button
      expect(items.at(0).props().disabled).toBe(true);
    });

    it('should disable the next button when on the last page', () => {
      setup({ number: 3, totalPages: 3, showPreviousAndNextButtons: true });

      const items = pagination.find('PaginationItem');

      // Next button
      expect(items.at(4).props().disabled).toBe(true);
    });
  });

  describe('events', () => {
    it('should call onChange when pagination links are clicked', () => {
      setup({ number: 5, totalPages: 10, showPreviousAndNextButtons: false });

      const links = pagination.find('PaginationLink');

      links.at(0).simulate('click');

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(1);

      links.at(2).simulate('click');

      expect(onChangeSpy).toHaveBeenCalledTimes(2);
      expect(onChangeSpy).toHaveBeenCalledWith(4);

      links.at(3).simulate('click');

      expect(onChangeSpy).toHaveBeenCalledTimes(3);
      expect(onChangeSpy).toHaveBeenCalledWith(5);

      links.at(4).simulate('click');

      expect(onChangeSpy).toHaveBeenCalledTimes(4);
      expect(onChangeSpy).toHaveBeenCalledWith(6);

      links.at(6).simulate('click');

      expect(onChangeSpy).toHaveBeenCalledTimes(5);
      expect(onChangeSpy).toHaveBeenCalledWith(10);
    });

    describe('previous and next buttons', () => {
      it('should have previous and next buttons which move the page forward or backwards', () => {
        setup({ number: 2, totalPages: 3, showPreviousAndNextButtons: true });

        const links = pagination.find('PaginationLink');

        // Previous button
        links.at(0).simulate('click');

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(1);

        // Next button
        links.at(4).simulate('click');

        expect(onChangeSpy).toHaveBeenCalledTimes(2);
        expect(onChangeSpy).toHaveBeenCalledWith(3);
      });
    });
  });
});

describe('pages', () => {
  test('exact middle', () => {
    expect(pagesFor(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10]);
  });

  test('almost middle', () => {
    expect(pagesFor(4, 10)).toEqual([1, '...', 3, 4, 5, '...', 10]);
    expect(pagesFor(6, 10)).toEqual([1, '...', 5, 6, 7, '...', 10]);
  });

  test('absolute left', () => {
    expect(pagesFor(1, 10)).toEqual([1, 2, '...', 10]);
  });

  test('almost left', () => {
    expect(pagesFor(2, 10)).toEqual([1, 2, 3, '...', 10]);
    expect(pagesFor(3, 10)).toEqual([1, 2, 3, 4, '...', 10]);
    expect(pagesFor(4, 10)).toEqual([1, '...', 3, 4, 5, '...', 10]);
  });

  test('almost right', () => {
    expect(pagesFor(7, 10)).toEqual([1, '...', 6, 7, 8, '...', 10]);
    expect(pagesFor(8, 10)).toEqual([1, '...', 7, 8, 9, 10]);
    expect(pagesFor(9, 10)).toEqual([1, '...', 8, 9, 10]);
  });

  test('absolute right', () => {
    expect(pagesFor(10, 10)).toEqual([1, '...', 9, 10]);
  });

  test('shortage', () => {
    expect(pagesFor(1, 3)).toEqual([1, 2, 3]);
    expect(pagesFor(3, 3)).toEqual([1, 2, 3]);
  });
});
