import React, {
  MouseEvent as RMouseEvent,
  useCallback,
  useEffect,
  useRef
} from 'react';
import { throttle } from 'lodash';

import { useEpicResizeListenerCleanup } from './useEpicResizeListenerCleanup';
import { listenerConfig } from './ListenerConfig';

type Props = {
  /**
   * The width of the EpicHeader which is resized.
   */
  width: number;

  /**
   * Callback which gives the EpicHeader the new width
   */
  onResize: (width: number) => void;
};

/**
 * The EpicResize component is a part of the EpicHeader. It contains
 * all the logic for resizing the EpicHeader. The EpicResize itself
 * is a tiny block rendered next to the EpicHeader, when the user
 * hovers over it the mouse icon will become a `col-resize`.
 */
export function EpicResize({ width, onResize }: Props) {
  // Stores the original width of when the EpicResize was first
  // rendered, you can never make it smaller than this original width
  // to prevent columns from becoming to small.
  const minWidth = useRef(width);

  // Throttle the onResize so the resizing becomes smooth. If we do
  // not throttle the resize will become very jarring / jittery.
  const throttledResize = useRef(throttle(onResize, 40));

  // When the onResize changes re-init the throttle.
  useEffect(() => {
    throttledResize.current = throttle(onResize, 40);
  }, [onResize]);

  // Stores the width of the element when the resize first started.
  const widthOnResizeStart = useRef(0);

  // Store the x position of the mouse when the resize first started.
  const mouseXOnResizeStart = useRef(0);

  const resize = useCallback((event: MouseEvent) => {
    const distance = event.clientX - mouseXOnResizeStart.current;

    const nextWidth = widthOnResizeStart.current + distance;

    const boundedWidth = Math.max(minWidth.current, nextWidth);

    throttledResize.current(boundedWidth);

    event.preventDefault();
  }, []);

  const resizeEnd = useCallback(() => {
    // Reset the cursor back to default
    document.body.style.cursor = 'default';

    // The page can now be selected again
    document.body.classList.remove('user-select-none');

    window.removeEventListener('mousemove', resize, listenerConfig);
  }, [resize]);

  const resizeStart = useCallback(
    (event: RMouseEvent<HTMLDivElement>, width: number) => {
      widthOnResizeStart.current = width;
      mouseXOnResizeStart.current = event.clientX;

      // The user can very quickly mouse beyond the EpicResize element
      // when this happens the cursor will become normal again. To
      // prevent this we simply set the cursor for the entire page to
      // col-resize until the user is done resizing.
      document.body.style.cursor = 'col-resize';

      // Prevent selection of text for the entire page until the user is
      // done resizing.
      document.body.classList.add('user-select-none');

      window.addEventListener('mousemove', resize, listenerConfig);
      window.addEventListener('mouseup', resizeEnd, listenerConfig);

      // You might think, why not do the onMouseMove and onMouseUp events
      // on the <div> itself. The reason is that the user will move
      // mouse faster than the elements width can grow. Plus if the
      // user moves a little too much on the Y axis he no longer hovers
      // over the <div>. So we simply listen to mouse events on the
      // entire document instead until the mouse goes up. This way the
      // user doesn't have to have 100% accuracy to resize the element.
    },
    [resize, resizeEnd]
  );

  useEpicResizeListenerCleanup(resize, resizeEnd);

  return (
    <div
      className="epic-table-header-resizeable"
      onMouseDown={(e) => resizeStart(e, width)}
      data-testid="epic-table-header-resize"
    />
  );
}
