import React, { ReactElement, Suspense } from 'react';
import { Nav } from 'reactstrap';
import { Tab } from './Tab/Tab';
import classNames from 'classnames';
import LoadingPage from '../LoadingPage/LoadingPage';
import { TabContent } from './TabContent/TabContent';

type Props = {
  children: (React.ReactElement | null)[];

  /**
   * Optionally set the way tabs are hidden from the user.
   *
   * There are two options:
   * - excluding the inactive tabs from the DOM
   * - hiding the inactive tabs using CSS
   *
   * The benefits of excluding inactive tabs from the DOM is that less elements appear on
   * the page. This gives better performance when the tabs contain more elements, because
   * React has fewer things to do, and the browser will be faster because there are less
   * elements in the DOM and probably less requests.
   *
   * The benefits from hiding inactive tabs using CSS is that the content can appear faster
   * when clicking to the next tab, because only the CSS is changed. So when the content of
   * the tabs are relatively small, it will have better performance.
   *
   * Another important use case for hiding inactive tabs using CSS is when the tabs are
   * used in a final-form. When all form elements are in the DOM, they will all participate
   * in the form validation. This way, form elements across all tabs are checked.
   *
   * By default, the tabs are excluded from the DOM when they are inactive.
   */
  hideInactiveTabsBy?: HideInactiveTabsBy;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

export type HideInactiveTabsBy = 'CSS' | 'excluding-from-dom';

/**
 * The Tabs component is a wrapper for multiple containers that will
 * be displayed only one at a time. A container can be activated by
 * clicking the related navigation item on top.
 * This component has Suspense built in to display a loader
 * and wait for its content to be fully loaded before displaying.
 */
export function Tabs({
  hideInactiveTabsBy = 'excluding-from-dom',
  children,
  className
}: Props) {
  React.Children.forEach(children, (child: ReactElement) => {
    if (child.type === Tab) {
      return;
    }

    throw new Error(
      'Tabs: expecting children of Tabs to be of type Tab but got something else',
      // @ts-expect-error accept that the type is not known here
      child.type
    );
  });

  return (
    <div className={classNames('tabs', className)}>
      <Nav tabs fill style={{ overflowY: 'hidden' }} className="flex-nowrap">
        {children}
      </Nav>
      <div className="mt-3 tab-content">
        <Suspense fallback={<LoadingPage height={200} className="bg-white" />}>
          {React.Children.map(
            children,
            ({ props: { children, ...rest } }: ReactElement) => (
              <TabContent hideInactiveTabsBy={hideInactiveTabsBy} {...rest}>
                {children}
              </TabContent>
            )
          )}
        </Suspense>
      </div>
    </div>
  );
}
