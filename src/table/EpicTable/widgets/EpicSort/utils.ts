import { Direction } from "../../types";

export function nextDirection(direction: Direction): Direction {
  if (direction === 'ASC') {
    return 'DESC';
  } else if (direction === 'DESC') {
    return 'ASC';
  } else {
    return 'ASC';
  }
}
