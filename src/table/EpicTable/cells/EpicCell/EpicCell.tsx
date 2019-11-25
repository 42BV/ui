import React from 'react';
import classNames from 'classnames';

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

// Props that will be injected by the EpicTable.
interface InjectedProps {
  odd: boolean;
}

/**
 * The EpicCell is used inside of a EpicRow to render content in.
 * It can be seen as the EpicTable's variant of the `<td>` element.
 */
export function EpicCell({ children, width, height, ...rest }: Props) {
  const { odd } = rest as InjectedProps;

  const classes = classNames('epic-table-cell border-bottom p-1', {
    'epic-table-cell--odd': odd
  });

  return (
    <div
      className={classes}
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
