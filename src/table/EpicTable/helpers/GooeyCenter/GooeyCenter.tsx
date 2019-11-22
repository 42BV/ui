/* istanbul ignore file */

// The EpicTable is really large and difficult to test via unit tests.
// Therefore there are a ton of stories for e2e testing instead. So
// that is why the EpicTable is ignored by istanbul.

import React, { useRef, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

type Props = {
  /**
   * What comes left of the GooeyCenter.
   */
  left: React.ReactNode;

  /**
   * The GooeyCenter a scrollbar will appear for the center when
   * it is to large to render on the screen.
   */
  center?: React.ReactNode;

  /**
   * What comes right of the GooeyCenter.
   */
  right?: React.ReactNode;

  /**
   * Optional callback which gives the current left scroll position
   * when the user scrolls. Is used sync the scroll of the FixedHeader.
   */
  onScroll?: (scrollLeft: number) => void;

  /**
   * Whether or not to show a scrollbar. The FixedHeader renders
   * a GooeyCenter without a scrollbar.
   */
  showScrollbar?: boolean;

  /**
   * Optional callback which gives the current center width as calculated
   * by the GooeyCenter. Used by the FixedHeader's GooeyCenter to match
   * sync the center width.
   */
  onCenterWidthChanged?: (centerWidth: number) => void;
};

/**
 * GooeyCenter is a table which has a fixed left or right or both
 * left and right, and a gooey center which takes up the remaining
 * space. No matter how little content is left for the center
 * the left and right are always visible.
 *
 * The center gets a horizontal scrollbar for when the content
 * is to large to fit in the center.
 *
 * GooeyCenter is not meant for consumers of the library and is
 * a private component.
 */
export function GooeyCenter({
  left,
  right,
  center,
  onScroll,
  showScrollbar = true,
  onCenterWidthChanged
}: Props) {
  const wrapperEl = useRef<HTMLDivElement>(null);
  const centerEl = useRef<HTMLDivElement>(null);

  const [centerWidth, setCenterWidth] = useState(0);

  useEffect(
    function trackCenterWidthBasedOnResize() {
      const calculateCenterWidth = debounce(() => {
        if (wrapperEl.current) {
          const left = wrapperEl.current.children[0];
          const right = wrapperEl.current.children[2];

          const rightWidth = right ? right.clientWidth : 0;

          const centerWidth =
            wrapperEl.current.clientWidth - left.clientWidth - rightWidth;

          setCenterWidth(centerWidth);

          if (onCenterWidthChanged) {
            onCenterWidthChanged(centerWidth);
          }
        }
      }, 200);

      window.addEventListener('resize', calculateCenterWidth);

      // Calculate at least once on startup
      calculateCenterWidth();

      return () => {
        window.removeEventListener('resize', calculateCenterWidth);
      };
    },
    [setCenterWidth, onCenterWidthChanged]
  );

  function handleScroll(this: OverlayScrollbars, event?: UIEvent) {
    if (onScroll && event) {
      onScroll((event.target as HTMLDivElement).scrollLeft);
    }
  }

  const centerWrapper = (
    <div
      ref={centerEl}
      // Making it undefined when not fully calculated, prevents
      // the content from instantly resizing and flickering.
      style={{ width: centerWidth !== 0 ? centerWidth : undefined }}
    >
      {center}
    </div>
  );

  return (
    <div className="d-flex" ref={wrapperEl}>
      {left}

      {center && showScrollbar ? (
        <OverlayScrollbarsComponent
          className="w-100"
          options={{
            scrollbars: {
              visibility: 'visible'
            },
            callbacks: {
              onScroll: handleScroll
            }
          }}
        >
          {centerWrapper}
        </OverlayScrollbarsComponent>
      ) : (
        centerWrapper
      )}

      {right}
    </div>
  );
}
