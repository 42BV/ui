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
 * The EpicFormCell is used inside of a EpicForm to render form inputs in.
 * It can be seen as the EpicForm's variant of the `<td>` element.
 */
export function EpicFormCell({ children, width, height }: Props) {
  return (
    <div
      className={'epic-table-form-cell border-bottom py-1 pr-1'}
      style={{
        minWidth: width,
        width,
        height,
        paddingLeft: '0px'
      }}
    >
      {children}
    </div>
  );
}
