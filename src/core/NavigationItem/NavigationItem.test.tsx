import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import NavigationItem from './NavigationItem';

describe('Component: NavigationItem', () => {
  let navigationItem: ShallowWrapper;

  function setup({ show = true }: { show?: (() => boolean) | boolean }) {
    navigationItem = shallow(
      <NavigationItem
        to="/dashboard"
        icon="dashboard"
        text="Dashboard"
        show={show}
      />
    );
  }

  test('ui', () => {
    setup({});
    expect(toJson(navigationItem)).toMatchSnapshot();
  });

  test('should not render when show is false', () => {
    setup({ show: false });
    expect(navigationItem.isEmptyRender()).toBe(true);
  });

  test('should render when predicate resolves to true', () => {
    setup({ show: () => 1 + 1 === 2 });
    expect(navigationItem.isEmptyRender()).toBe(false);
  });

  test('should not render when predicate resolves to false', () => {
    setup({ show: () => 1 + 2 === 2 });
    expect(navigationItem.isEmptyRender()).toBe(true);
  });

  test('should default show to true if it is not provided', () => {
    const navigationItem = shallow(
      <NavigationItem to="/dashboard" icon="dashboard" text="Dashboard" />
    );

    expect(navigationItem.isEmptyRender()).toBe(false);
  });
});
