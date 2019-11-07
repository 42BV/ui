import React from 'react';

import { Icon, IconType } from '../../../../core/Icon';
import { Direction } from '../../types';
import { nextDirection } from './utils';

export interface Props {
  /**
   * The current direction of the sort.
   */
  direction: Direction;

  /**
   * The callback which is called when the direction changes.
   */
  onChange: (direction: Direction) => void;
}

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

function iconForDirection(direction: Direction): IconType {
  if (direction === 'ASC') {
    return 'arrow_drop_up';
  } else if (direction === 'DESC') {
    return 'arrow_drop_down';
  } else {
    return 'sort';
  }
}