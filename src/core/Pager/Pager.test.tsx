import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Page } from '@42.nl/spring-connect';

import Pager from './Pager';

describe('Component: Pager', () => {
  let pager: ShallowWrapper;
  let onChangeSpy: jest.Mock;

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

    onChangeSpy = jest.fn();

    const props = {
      page,
      onChange: onChangeSpy
    };

    pager = shallow(<Pager {...props} />);
  }

  describe('ui', () => {
    test('empty', () => {
      setup({ number: 1, totalPages: 1 });

      expect(pager.isEmptyRender()).toBe(true);
    });

    test('normal', () => {
      setup({ number: 5, totalPages: 10 });

      expect(toJson(pager)).toMatchSnapshot('Component: Pager => normal');
    });

    test('first', () => {
      setup({ number: 1, totalPages: 10 });

      expect(toJson(pager)).toMatchSnapshot('Component: Pager => first');
    });

    test('last', () => {
      setup({ number: 10, totalPages: 10 });

      expect(toJson(pager)).toMatchSnapshot('Component: Pager => last');
    });
  });

  describe('events', () => {
    it('should call onChange when previous or next button is clicked', () => {
      setup({ number: 5, totalPages: 10 });

      const buttons = pager.find('Button');

      const next = buttons.at(0);
      const previous = buttons.at(1);

      next.simulate('click');

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(4);

      previous.simulate('click');

      expect(onChangeSpy).toHaveBeenCalledTimes(2);
      expect(onChangeSpy).toHaveBeenCalledWith(6);
    });
  });
});
