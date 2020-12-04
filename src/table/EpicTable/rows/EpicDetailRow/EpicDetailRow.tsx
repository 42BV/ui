import React, { forwardRef, Ref, RefObject } from 'react';

export type Props = {
  /**
   * A render function which gets called when `active` is true.
   */
  children: () => React.ReactNode;

  /**
   * Whether or not the children should be rendered.
   */
  active: boolean;

  /**
   * How much the EpicDetailRow should be placed to the left.
   * Best to use the width of the first column so it aligns
   * just next to the first column.
   */
  left: number;
};

// Props that will be injected by the EpicTable.
type InjectedProps = {
  width: number;
  top: number;
  height: number;
  ref: Ref<HTMLDivElement>;
};

function epicDetailRow(
  { children, active, left, ...rest }: Props,
  ref: RefObject<HTMLDivElement>
) {
  if (!active) {
    return null;
  }

  const { width, top, height } = rest as InjectedProps;

  return (
    <div
      ref={ref}
      className="epic-table-detail-row"
      style={{
        minWidth: width,
        width,
        height,
        left,
        top
      }}
    >
      {children()}
    </div>
  );
}

/**
 * The EpicDetailRow is a row inside of an EpicTable which can be used
 * to show details whenever a row is clicked. It displays itself over
 * the rest of the EpicTable on the left.
 *
 * Often used in combination with the EpicDetail widget component.
 */
export const EpicDetailRow = forwardRef(epicDetailRow);
