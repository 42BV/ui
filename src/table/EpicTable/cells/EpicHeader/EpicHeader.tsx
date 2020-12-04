import React from 'react';

import { EpicResize } from './EpicResize/EpicResize';

type Props = {
  /**
   * The content of the cell.
   */
  children: React.ReactNode;

  /**
   * The width of the cell.
   */
  width: number;

  /**
   * The height of the cell.
   */
  height: number;

  /**
   * Optionally a callback for when the width has changed. By setting
   * this callback you enable the resizing of the EpicHeader.
   *
   * You can never resize the width to less of the original width to
   * prevent columns from becoming to small.
   *
   * When this callback is called you should store the `width` and
   * pass it back into the EpicHeader as the `width` property.
   */
  onResize?: (width: number) => void;
};

/**
 * The EpicHeader is used inside of a EpicRow to render headers with
 * It can be seen as the EpicTable's variant of the `<th>` element.
 *
 * It is resizable whenever the `onResize` callback is defined.
 */
export function EpicHeader({ children, width, height, onResize }: Props) {
  return (
    <div
      className="epic-table-header d-flex align-items-center justify-content-between p-1"
      style={{
        minWidth: width,
        width,
        height
      }}
    >
      {children}

      {onResize ? <EpicResize width={width} onResize={onResize} /> : null}
    </div>
  );
}
