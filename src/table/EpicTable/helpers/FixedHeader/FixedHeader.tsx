/* istanbul ignore file */

// The EpicTable is really large and difficult to test via unit tests.
// Therefore, there are a ton of stories for e2e testing instead. So
// that is why the EpicTable is ignored by istanbul.

import { useEffect, useRef } from 'react';

import { GooeyCenter } from '../GooeyCenter/GooeyCenter';
import { EpicTableLayout } from '../layout/layout';
import { useClosestHeaderIndex } from './useClosestHeaderIndex';
import { HeaderRef } from '../../types';

type Props = {
  /**
   * The width of the actual center so the FixedHeader can match
   * the center's width.
   */
  centerWidth: number;

  /**
   * The amount the actual center has scrolled to the left.
   */
  leftScroll: number;

  /**
   * The layout information of the EpicTable, so the FixedHeader
   * knows which sides to show.
   */
  layout: EpicTableLayout;

  /**
   * All the headers that the EpicTable is currently rendering. Used
   * to determine which header is closest to the top of the screen,
   * sot that the FixedHeader can take that header as its appearance.
   */
  headers: HeaderRef[];
};

/**
 * The FixedHeader is a header which follows the user as he scrolls.
 * The FixedHeader is not meant for consumers of this library and
 * is an internal component.
 */
export function FixedHeader({
  centerWidth,
  leftScroll,
  layout,
  headers
}: Props) {
  const fixedHeaderEl = useRef<HTMLDivElement>(null);
  const fixedCenterEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fixedCenterEl.current) {
      fixedCenterEl.current.scrollLeft = leftScroll;
    }
  }, [fixedCenterEl, leftScroll]);

  const { left, center, right } = layout;

  const index = useClosestHeaderIndex(fixedHeaderEl, headers);

  const showFixedHeader = index !== -1;

  return (
    <div className="epic-table-fixed-header" ref={fixedHeaderEl}>
      {showFixedHeader ? (
        <GooeyCenter
          forceCenterAlwaysVisible={true}
          left={left && left[index] ? left[index].header : null}
          center={
            center && center[index] ? (
              <div
                ref={fixedCenterEl}
                className="d-flex justify-content-between overflow-hidden"
                style={{ width: centerWidth }}
              >
                {center[index].header}
              </div>
            ) : null
          }
          right={right && right[index] ? right[index].header : null}
          showScrollbar={false}
        />
      ) : null}
    </div>
  );
}
