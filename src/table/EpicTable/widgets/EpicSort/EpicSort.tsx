import React from 'react';

import { Icon, IconType } from '../../../../core/Icon';
import { EpicTableSortDirection } from '../../types';
import { nextDirection } from './utils';

export type Props = {
  /**
   * The current direction of the sort.
   */
  direction: EpicTableSortDirection;

  /**
   * The callback which is called when the direction changes.
   */
  onChange: (direction: EpicTableSortDirection) => void;
};

/**
 * The EpicSort is a button which shows the user a sort direction. When
 * the user clicks the button it will go to the next direction.
 *
 * The directions go from:
 *
 *  NONE -> ASC -> DESC
 *           ^       |
 *           |--------
 */
export function EpicSort({ direction, onChange }: Props) {
  return (
    <Icon
      className="pr-1"
      onClick={() => onChange(nextDirection(direction))}
      icon={iconForDirection(direction)}
    />
  );
}

function iconForDirection(direction: EpicTableSortDirection): IconType {
  if (direction === 'ASC') {
    return 'arrow_drop_up';
  } else if (direction === 'DESC') {
    return 'arrow_drop_down';
  } else {
    return 'sort';
  }
}
