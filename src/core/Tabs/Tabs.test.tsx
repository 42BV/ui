import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { HideInactiveTabsBy, Tabs } from './Tabs';
import { Tab } from './Tab/Tab';
import { Icon } from '../Icon';

describe('Component: Tabs', () => {
  function setup({
    hideInactiveTabsBy
  }: {
    hideInactiveTabsBy?: HideInactiveTabsBy;
  }) {
    const tabs = shallow(
      <Tabs hideInactiveTabsBy={hideInactiveTabsBy}>
        <Tab active={true} label="test active true" onClick={jest.fn()}>
          {() => <p>test active true</p>}
        </Tab>
        <Tab active={false} label="test active false" onClick={jest.fn()}>
          {() => <p>test active false</p>}
        </Tab>
      </Tabs>
    );

    return { tabs };
  }

  describe('ui', () => {
    test('hide inactive tabs by removing from dom', () => {
      const { tabs } = setup({});

      expect(toJson(tabs)).toMatchSnapshot(
        'Component: Tabs => ui => hide inactive tabs by removing from dom'
      );
    });

    test('hide inactive tabs by CSS', () => {
      const { tabs } = setup({ hideInactiveTabsBy: 'CSS' });

      expect(toJson(tabs)).toMatchSnapshot(
        'Component: Tabs => ui => hide inactive tabs by CSS'
      );
    });

    it('should throw an exception if any child is not a Tab component', () => {
      expect(() =>
        shallow(
          // @ts-expect-error Test mock
          <Tabs>
            <Icon icon="close" />
          </Tabs>
        )
      ).toThrowErrorMatchingSnapshot();
    });
  });
});
