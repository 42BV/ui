/* istanbul ignore file */

// The EpicTable is really large and difficult to test via unit tests.
// Therefore there are a ton of stories for e2e testing instead. So
// that is why the EpicTable is ignored by istanbul.

import React, { useRef, Fragment, useState } from 'react';

import { FixedHeader } from './helpers/FixedHeader/FixedHeader';
import { GooeyCenter } from './helpers/GooeyCenter/GooeyCenter';

import { epicTableLayout } from './helpers/layout/layout';
import { HeaderRef } from './types';
import { useEpicTableRect } from './helpers/useEpicTableRect';

interface Props {
  // What I really want to expres here is is that children only
  // accepts rows or `Fragments` containing rows But I cannot expres
  // this properly so it is unfortunately of type 'any'.

  /**
   * The rows of the EpicTable. Or Fragments on one level deep
   * containing rows.
   */
  children: any;

  /**
   * The minimum height of the EpicTable. This way when the table
   * is empty it still has a height.
   *
   * Defaults to 600 pixels.
   */
  minHeight?: number;

  /**
   * Whether or not to render a fixed right column.
   *
   * Defaults to true
   */
  hasRight?: boolean;

  /**
   * Optionally an overlay to show below the first header of the
   * table. Can contain anything, can be used to render loading /
   * error states.
   */
  overlay?: React.ReactNode;
}

/**
 * The EpicTable is a table based on Andrew Colyle's article
 * "Design better data tables" which can be found here:
 * https://uxdesign.cc/design-better-data-tables-4ecc99d23356
 *
 * The features the EpicTable supports:
 *
 *   1. Fixed headers which follow the user.
 *   2. A fixed left column which follows the user.
 *   3. Optionally a fixed right column which follows the user.
 *   4. Expanding rows which can contain extra data.
 *   5. Click to go to details inside of the table.
 *   6. Selection of rows, and a select all.
 *   7. Filtering per column.
 *   8. Resizing of columns.
 *   9. Multiple headers
 * 
 * See the stories in the documentation for detailed examples.
 * 
 * That said there are a couple of rules:
 * 
 *   1. Do not render anything inside of the EpicTable which is not
 *      one of the row's. The EpicTable will not understand those and
 *      it will error.
 * 
 *   2. The EpicTable can contain fragments, and will unpack those, but
 *      only one level deep. Those fragments should contain only row's.
 */
export function EpicTable({
  children,
  minHeight = 600,
  hasRight = true,
  overlay
}: Props) {
  const epicTableEl = useRef<HTMLDivElement>(null);

  const [centerWidth, setCenterWidth] = useState(0);
  const [leftScroll, setLeftScroll] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const headerRefs: HeaderRef[] = [];

  function registerHeader(ref, index) {
    if (ref) {
      headerRefs.push({ ref, index });

      setHeaderHeight(ref.clientHeight);
    }
  }

  const epicTableRect = useEpicTableRect(epicTableEl);

  const layout = epicTableLayout(children, epicTableRect, hasRight);

  const { center, right, left, containsActiveDetailRow } = layout;

  return (
    <div
      ref={epicTableEl}
      className="epic-table"
      style={{ minHeight: minHeight }}
    >
      <div className="epic-table-container">
        {overlay && epicTableRect ? (
          <div
            className="epic-table-overlay shadow"
            style={{
              top: headerHeight,
              minHeight: epicTableRect.height - headerHeight,
              width: epicTableRect.width
            }}
          >
            {overlay}
          </div>
        ) : null}

        <FixedHeader
          centerWidth={centerWidth}
          headers={headerRefs}
          leftScroll={leftScroll}
          layout={layout}
        />

        <GooeyCenter
          onCenterWidthChanged={setCenterWidth}
          onScroll={setLeftScroll}
          left={
            <div className={overlay ? '' : 'shadow'} style={{ minHeight }}>
              {left.map((section, index) => (
                <Fragment key={index}>
                  <div ref={ref => registerHeader(ref, index)}>
                    {section.header}
                  </div>

                  {section.contents}
                </Fragment>
              ))}
            </div>
          }
          center={
            center.length > 0
              ? center.map((section, index) => (
                  <Fragment key={index}>
                    <div className="d-flex justify-content-between">
                      {section.header}
                    </div>

                    {section.contents.map((row, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between"
                      >
                        {row}
                      </div>
                    ))}
                  </Fragment>
                ))
              : null
          }
          right={
            hasRight && right.length > 0 ? (
              <div
                className={containsActiveDetailRow || overlay ? '' : 'shadow'}
              >
                {right.map((section, index) => (
                  <Fragment key={index}>
                    {section.header}

                    {section.contents}
                  </Fragment>
                ))}
              </div>
            ) : null
          }
        />
      </div>
    </div>
  );
}
