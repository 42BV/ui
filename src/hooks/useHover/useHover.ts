import { useState } from 'react';

type UseHoverResult = [
  /**
   * Whether or not the element is hovered
   */
  boolean,

  /**
   * The mouse events through which the hook knows the element
   * is hovering. You must apply these mouse events on the element
   * you want the hover state of.
   */
  {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  }
];

/**
 * Returns whether or not the element is hovered.
 *
 * @example
 *
 * ```tsx
 * function HoveredComponent() {
 *   const { hover, hoverEvents } = useHover();
 *
 *    return (
 *      <div className={hover ? 'active' : ''} {...hoverEvents} />
 *    );
 * }
 */
export function useHover(): UseHoverResult {
  const [ hover, setHover ] = useState(false);

  function onMouseEnter() {
    setHover(true);
  }

  function onMouseLeave() {
    setHover(false);
  }

  return [ hover, { onMouseEnter, onMouseLeave } ];
}
