import { render } from '@testing-library/react';

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
    const { container } = render(
      <TabContent
        hideInactiveTabsBy={hideInactiveTabsBy}
        show={show}
        active={active}
      >
        {() => <p>This is content</p>}
      </TabContent>
    );

    return { container };
  }

  test('ui', () => {
    const { container } = setup({ hideInactiveTabsBy: 'CSS', active: true });
    expect(container).toMatchSnapshot();
  });

  it('should return null when show returns false', () => {
    const { container } = setup({
      hideInactiveTabsBy: 'excluding-from-dom',
      active: true,
      show: () => false
    });
    expect(container.firstChild).toBeNull();
  });

  it('should return null when hide inactive tabs by excluding from dom and inactive', () => {
    const { container } = setup({
      hideInactiveTabsBy: 'excluding-from-dom',
      active: false
    });
    expect(container.firstChild).toBeNull();
  });

  test('should not return null when hide inactive tabs by CSS and inactive', () => {
    const { container } = setup({ hideInactiveTabsBy: 'CSS', active: false });
    expect(container.firstChild).not.toBeNull();
  });

  it('should not return null when hide inactive tabs by excluding from dom and active', () => {
    const { container } = setup({
      hideInactiveTabsBy: 'excluding-from-dom',
      active: true
    });
    expect(container.firstChild).not.toBeNull();
  });

  it('should not return null when hide inactive tabs by CSS and active', () => {
    const { container } = setup({ hideInactiveTabsBy: 'CSS', active: true });
    expect(container.firstChild).not.toBeNull();
  });
});
