import React, { useRef } from 'react';

import { EpicResize } from './EpicResize/EpicResize';

export type Props = {
  /**
   * The content of the cell.
   */
  children: React.ReactNode;

  /**
   * The minimum width of the cell in pixels.
   * Defaults to the value of width.
   */
  minWidth?: number;

  /**
   * The width of the cell in pixels.
   */
  width: number;

  /**
   * Optionally the height of the cell in pixels.
   * Defaults to 44.
   */
  height?: number;

  /**
   * Optionally a callback for when the width has changed. By setting
   * this callback you enable the resizing of the EpicHeader.
   *
   * You can never resize the width to less than the original width to
   * prevent columns from becoming too small.
   *
   * When this callback is called you should store the `width` and
   * pass it back into the EpicHeader as the `width` property.
   */
  onResize?: (width: number) => void;
};

/**
 * The EpicHeader is used inside a EpicRow to render headers with
 * It can be seen as the EpicTable's variant of the `<th>` element.
 *
 * It is resizable whenever the `onResize` callback is defined.
 */
export function EpicHeader({
  children,
  width,
  minWidth,
  height = 44,
  onResize
}: Props) {
  // Store the original width of when the EpicHeader was first rendered
  // when minWidth is not specified to prevent resizing only allowing
  // columns to grow.
  const minimumWidth = useRef(minWidth ?? width);
  return (
    <div
      className="epic-table-header d-flex align-items-center justify-content-between p-1"
      style={{
        minWidth: minimumWidth.current,
        width,
        height
      }}
    >
      {children}

      {onResize ? (
        <EpicResize
          minWidth={minimumWidth.current}
          width={width}
          onResize={onResize}
        />
      ) : null}
    </div>
  );
}
