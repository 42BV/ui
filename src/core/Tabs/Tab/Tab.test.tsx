import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { Tab } from './Tab';

describe('Component: Tab', () => {
  function setup({
    active = true,
    hasIcon,
    hasIconColor,
    show,
    disabled
  }: {
    active?: boolean;
    hasIcon?: boolean;
    hasIconColor?: boolean;
    show?: boolean;
    disabled?: boolean;
  }) {
    const onClickSpy = jest.fn();
    const showSpy = jest.fn().mockReturnValue(show);

    const tab = shallow(
      <Tab
        active={active}
        label="test"
        onClick={onClickSpy}
        icon={hasIcon ? 'close' : undefined}
        iconColor={hasIconColor ? 'primary' : undefined}
        show={show !== undefined ? showSpy : undefined}
        disabled={disabled}
      >
        {() => <p>test</p>}
      </Tab>
    );

    return { tab, onClickSpy, showSpy };
  }

  it('should return null when show returns false', () => {
    const { tab, showSpy } = setup({ show: false });

    expect(showSpy).toHaveBeenCalledTimes(1);
    expect(toJson(tab)).toBe('');
  });

  describe('ui', () => {
    test('without icon', () => {
      const { tab } = setup({});

      expect(toJson(tab)).toMatchSnapshot(
        'Component: Tab => ui => without icon'
      );
    });

    test('with icon', () => {
      const { tab } = setup({ hasIcon: true });

      expect(toJson(tab)).toMatchSnapshot('Component: Tab => ui => with icon');
    });

    test('icon color', () => {
      const { tab } = setup({ hasIcon: true, hasIconColor: true });

      expect(tab.find('Icon').props().color).toBe('primary');
    });

    test('not active', () => {
      const { tab } = setup({ active: false });

      // @ts-expect-error Test mock
      expect(tab.find('NavLink').props().active).toBe(false);
    });

    test('not active', () => {
      const { tab } = setup({ active: false, disabled: true });

      expect(tab.find('NavLink').props().disabled).toBe(true);
    });
  });

  describe('events', () => {
    it('should call onClick when NavLink is clicked', () => {
      const { tab, onClickSpy } = setup({});

      expect(onClickSpy).toHaveBeenCalledTimes(0);

      // @ts-expect-error Test mock
      tab.find('NavLink').props().onClick();

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });
});
