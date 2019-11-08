import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { NavLink } from 'reactstrap';

import NavigationItem from './NavigationItem';

describe('Component: NavigationItem', () => {
  function setup({
    show = true,
    exact
  }: {
    show?: (() => boolean) | boolean;
    exact?: boolean;
  }) {
    const navigationItem = shallow(
      <NavigationItem
        to="/dashboard"
        icon="dashboard"
        text="Dashboard"
        show={show}
        exact={exact}
      />
    );

    return { navigationItem };
  }

  test('ui', () => {
    const { navigationItem } = setup({});
    expect(toJson(navigationItem)).toMatchSnapshot();
  });

  describe('show behavior', () => {
    it('should not render when show is false', () => {
      const { navigationItem } = setup({ show: false });
      expect(navigationItem.isEmptyRender()).toBe(true);
    });

    it('should render when predicate resolves to true', () => {
      const { navigationItem } = setup({ show: () => 1 + 1 === 2 });
      expect(navigationItem.isEmptyRender()).toBe(false);
    });

    it('should not render when predicate resolves to false', () => {
      const { navigationItem } = setup({ show: () => 1 + 2 === 2 });
      expect(navigationItem.isEmptyRender()).toBe(true);
    });

    it('should default show to true if it is not provided', () => {
      const navigationItem = shallow(
        <NavigationItem to="/dashboard" icon="dashboard" text="Dashboard" />
      );

      expect(navigationItem.isEmptyRender()).toBe(false);
    });
  });

  describe('exact behavior', () => {
    it('should default to exact when exact is undefined', () => {
      const { navigationItem } = setup({ exact: undefined });

      const exact = navigationItem.find(NavLink).props().exact;

      expect(exact).toBe(true);
    });

    it('should be able to set exact to false', () => {
      const { navigationItem } = setup({ exact: false });

      const exact = navigationItem.find(NavLink).props().exact;

      expect(exact).toBe(false);
    });
  });
});
