import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { TabContent } from './TabContent';
import { HideInactiveTabsBy } from '../Tabs';

describe('Component: TabContent', () => {
  function setup({
    hideInactiveTabsBy,
    active,
    show
  }: {
    hideInactiveTabsBy: HideInactiveTabsBy;
    active: boolean;
    show?: () => boolean;
  }) {
    const tabContent = shallow(
      <TabContent
        hideInactiveTabsBy={hideInactiveTabsBy}
        show={show}
        active={active}
      >
        {() => <p>This is content</p>}
      </TabContent>
    );

    return { tabContent };
  }

  describe('not active', () => {
    it('should return null when show returns false', () => {
      const { tabContent } = setup({
        hideInactiveTabsBy: 'excluding-from-dom',
        active: true,
        show: () => false
      });
      expect(toJson(tabContent)).toBe('');
    });

    it('should return null when hide inactive tabs by removing from dom', () => {
      const { tabContent } = setup({
        hideInactiveTabsBy: 'excluding-from-dom',
        active: false
      });
      expect(toJson(tabContent)).toBe('');
    });

    test('hide inactive tabs by CSS', () => {
      const { tabContent } = setup({
        hideInactiveTabsBy: 'CSS',
        active: false
      });

      expect(toJson(tabContent)).toMatchSnapshot(
        'Component: TabContent => inactive => hide inactive tabContent by CSS'
      );
    });
  });

  describe('active', () => {
    test('hide inactive tabs by excluding from dom', () => {
      const { tabContent } = setup({
        hideInactiveTabsBy: 'excluding-from-dom',
        active: true
      });

      expect(toJson(tabContent)).toMatchSnapshot(
        'Component: TabContent => active => hide inactive tabContent by excluding from dom'
      );
    });

    test('hide inactive tabs by CSS', () => {
      const { tabContent } = setup({ hideInactiveTabsBy: 'CSS', active: true });

      expect(toJson(tabContent)).toMatchSnapshot(
        'Component: TabContent => active => hide inactive tabContent by CSS'
      );
    });
  });
});
