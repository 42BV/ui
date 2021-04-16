import { alwaysTrue } from '../../../form/utils';
import classNames from 'classnames';
import React from 'react';
import { HideInactiveTabsBy } from '../Tabs';

export type Props = {
  show?: () => boolean;
  active: boolean;
  hideInactiveTabsBy: HideInactiveTabsBy;
  children: () => React.ReactNode;
};

export function TabContent({
  show = alwaysTrue,
  active,
  children,
  hideInactiveTabsBy
}: Props) {
  if (!show()) {
    return null;
  }

  if (hideInactiveTabsBy === 'excluding-from-dom' && !active) {
    return null;
  }

  return (
    <div
      className={classNames('tab-pane', {
        active
      })}
    >
      {children()}
    </div>
  );
}
