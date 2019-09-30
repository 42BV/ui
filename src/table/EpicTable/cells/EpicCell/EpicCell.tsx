import React from 'react';

interface Props {
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
}

/**
 * The EpicCell is used inside of a EpicRow to render content in.
 * It can be seen as the EpicTable's variant of the `<td>` element.
 */
export function EpicCell({ children, width, height }: Props) {
  return (
    <div
      className="epic-table-cell border-bottom p-1"
      style={{
        minWidth: width,
        width,
        height
      }}
    >
      {children}
    </div>
  );
}
