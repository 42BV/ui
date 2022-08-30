import React from 'react';

export type Props = {
  /**
   * A render function which gets called when `active` is true.
   */
  children: () => React.ReactNode;

  /**
   * Whether the children should be rendered.
   */
  active: boolean;

  /**
   * The height the EpicExpanderRow should take up when expanded.
   */
  height: number;
};

// Props that will be injected by the EpicTable.
type InjectedProps = {
  width: number;
};

/**
 * The EpicExpanderRow is a row inside an EpicTable which can be used
 * to show details whenever a row is clicked. It displays itself over
 * under the cell which is expanded.
 *
 * Often used in combination with the EpicExpander widget component.
 */
export function EpicExpanderRow({ children, active, height, ...rest }: Props) {
  if (!active) {
    return null;
  }

  const { width } = rest as InjectedProps;

  return (
    <div
      className="epic-table-expander-row"
      style={{
        minWidth: width,
        width,
        height
      }}
    >
      {children()}
    </div>
  );
}
