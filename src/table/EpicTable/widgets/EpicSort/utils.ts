import { EpicTableSortDirection } from '../../types';

export function nextDirection(
  direction: EpicTableSortDirection
): EpicTableSortDirection {
  if (direction === 'ASC') {
    return 'DESC';
  } else if (direction === 'DESC') {
    return 'ASC';
  } else {
    return 'ASC';
  }
}
