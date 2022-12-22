import React from 'react';
import { render, screen } from '@testing-library/react';

import { HideInactiveTabsBy, Tabs } from './Tabs';
import { Tab } from './Tab/Tab';
import { Icon } from '../Icon';

describe('Component: Tabs', () => {
  function setup({
    hideInactiveTabsBy
  }: {
    hideInactiveTabsBy?: HideInactiveTabsBy;
  }) {
    const { container } = render(
      <Tabs hideInactiveTabsBy={hideInactiveTabsBy}>
        <Tab active={true} label="active tab" onClick={vi.fn()}>
          {() => <p>test active true</p>}
        </Tab>
        <Tab active={false} label="not active tab" onClick={vi.fn()}>
          {() => <p>test active false</p>}
        </Tab>
      </Tabs>
    );

    return { container };
  }

  describe('ui', () => {
    test('hide inactive tabs by removing from dom', async () => {
      expect.assertions(2);
      const { container } = setup({});
      await screen.findByText('test active true');
      expect(screen.queryByText('test active false')).toBeNull();
      expect(container).toMatchSnapshot();
    });

    test('hide inactive tabs by CSS', async () => {
      expect.assertions(3);
      const { container } = setup({ hideInactiveTabsBy: 'CSS' });
      await screen.findByText('test active true');
      await screen.findByText('test active false');
      expect(
        screen
          .getByText('test active true')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.classList.contains('active')
      ).toBe(true);
      expect(
        screen
          .getByText('test active false')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.classList.contains('active')
      ).toBe(false);
      expect(container).toMatchSnapshot();
    });

    it('should throw an exception if any child is not a Tab component', () => {
      vi.spyOn(console, 'error').mockImplementation(vi.fn());
      expect(() =>
        render(
          // @ts-expect-error Test mock
          <Tabs>
            <Icon icon="close" />
          </Tabs>
        )
      ).toThrowErrorMatchingSnapshot();
    });
  });
});
