import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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
        <Tab active={true} label="active tab" onClick={jest.fn()}>
          {() => <p>test active true</p>}
        </Tab>
        <Tab active={false} label="not active tab" onClick={jest.fn()}>
          {() => <p>test active false</p>}
        </Tab>
      </Tabs>
    );

    return { container };
  }

  describe('ui', () => {
    test('hide inactive tabs by removing from dom', () => {
      const { container } = setup({});
      expect(screen.queryByText('test active true')).toBeInTheDocument();
      expect(screen.queryByText('test active false')).not.toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });

    test('hide inactive tabs by CSS', () => {
      const { container } = setup({ hideInactiveTabsBy: 'CSS' });
      expect(screen.queryByText('test active true')).toBeInTheDocument();
      expect(screen.queryByText('test active false')).toBeInTheDocument();
      expect(screen.getByText('test active true').parentNode).toHaveClass(
        'active'
      );
      expect(screen.getByText('test active false').parentNode).not.toHaveClass(
        'active'
      );
      expect(container).toMatchSnapshot();
    });

    it('should throw an exception if any child is not a Tab component', () => {
      jest.spyOn(console, 'error').mockImplementation(jest.fn());
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
