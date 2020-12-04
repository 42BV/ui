import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import MoreOrLess from './MoreOrLess';

describe('Component: MoreOrLess', () => {
  let moreOrLess: ShallowWrapper;

  function setup({
    exceedsLimit,
    text
  }: {
    exceedsLimit: boolean;
    text?: { more?: (amount: number) => string; less?: string };
  }) {
    let content: JSX.Element[];
    if (exceedsLimit) {
      content = [
        <h1 key={1}>1</h1>,
        <h1 key={2}>2</h1>,
        <h1 key={3}>3</h1>,
        <h1 key={4}>4</h1>,
        <h1 key={5}>5</h1>,
        <h1 key={6}>6</h1>
      ];
    } else {
      content = [<h1 key={1}>1</h1>, <h1 key={2}>2</h1>, <h1 key={3}>3</h1>];
    }

    moreOrLess = shallow(
      <MoreOrLess limit={3} content={content} text={text} />
    );
  }

  function open() {
    moreOrLess.find('.more-or-less-link').simulate('click');

    expect(
      moreOrLess.find('.more-or-less').hasClass('more-or-less-opened')
    ).toBe(true);
  }

  function close() {
    moreOrLess.find('.more-or-less-link').simulate('click');

    expect(
      moreOrLess.find('.more-or-less').hasClass('more-or-less-closed')
    ).toBe(true);
  }

  describe('ui', () => {
    test('open', () => {
      setup({ exceedsLimit: true });
      open();
      expect(toJson(moreOrLess)).toMatchSnapshot(
        'Component: MoreOrLess => ui => open'
      );
    });

    test('closed', () => {
      setup({ exceedsLimit: true });
      expect(toJson(moreOrLess)).toMatchSnapshot(
        'Component: MoreOrLess => ui => closed'
      );
    });

    test('to few items', () => {
      setup({ exceedsLimit: false });
      expect(toJson(moreOrLess)).toMatchSnapshot(
        'Component: MoreOrLess => ui => to few items'
      );
    });

    test('with custom text', () => {
      setup({
        exceedsLimit: true,
        text: {
          more: (amount) => `Load ${amount} more...`
        }
      });

      expect(moreOrLess.find('div[role="button"]').text()).toEqual(
        'Load 3 more...'
      );
    });
  });

  test('toggle', () => {
    setup({ exceedsLimit: true });

    open();
    close();
    open();
  });
});
