import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { Debug } from './Debug';

describe('Component: Debug', () => {
  function setup({ defaultOpen }: { defaultOpen?: boolean }) {
    const debug = shallow(
      <Debug value={{ property: 'test' }} defaultOpen={defaultOpen} />
    );
    return { debug };
  }

  test('ui', () => {
    const { debug } = setup({});

    expect(toJson(debug)).toMatchSnapshot();
    expect(toJson(debug.props().children())).toMatchSnapshot();
  });

  it('should start closed when open is false', () => {
    const { debug } = setup({ defaultOpen: false });
    expect(debug.props().isOpen).toBe(false);
  });

  it('should start open when open is true', () => {
    const { debug } = setup({ defaultOpen: true });
    expect(debug.props().isOpen).toBe(true);
  });

  it('should start open when open is undefined', () => {
    const { debug } = setup({});
    expect(debug.props().isOpen).toBe(true);
  });

  describe('events', () => {
    it('should toggle isOpen', () => {
      const setIsOpenSpy = jest.fn();
      jest.spyOn(React, 'useState').mockReturnValue([true, setIsOpenSpy]);

      const { debug } = setup({});

      debug.props().toggle();

      expect(setIsOpenSpy).toHaveBeenCalledTimes(1);
      expect(setIsOpenSpy).toHaveBeenCalledWith(false);
    });
  });
});
