import React from 'react';

/**
 * Enumerates the supported layouts of the EpicCellLayout.
 */
type EpicCellLayoutMode = 'vertical' | 'horizontal';

type Props = {
  /**
   *  Determines which layout the cell has.
   */
  mode: EpicCellLayoutMode;

  /**
   * The content of the cell.
   */
  children: React.ReactNode;
};

/**
 * The EpicCellLayout is used inside a EpicHeader or EpicCell to
 * define the layout of that cell.
 *
 * It currently supports two modes: `vertical` and `horizontal`.
 *
 * The `vertical` mode will take the full height and width and
 * positions the children vertically whilst padding them in the top
 * and bottom.
 *
 * The `horizontal` mode will take the full width and positions the
 * children horizontally and places the maximum space in between
 * the children. This means that when two children are present one
 * will be on the utmost left and the other on the utmost right.
 *
 * Basically a small wrapper around the `d-flex` utilities of bootstrap.
 */
export function EpicCellLayout({ children, mode }: Props) {
  if (mode === 'vertical') {
    return (
      <div className="d-flex flex-column w-100 h-100 justify-content-around">
        {children}
      </div>
    );
  } else {
    return (
      <div className="d-flex w-100 justify-content-between align-items-center">
        {children}
      </div>
    );
  }
}
