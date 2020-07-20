import React from 'react';

export interface Props {
  /**
   * The cells of the EpicRow
   */
  children: React.ReactNode;

  /**
   * Whether or not this EpicRow is a header.
   */
  header?: boolean;

  /**
   * Optional callback for what needs to happen when the `EpicRow` is
   * clicked. When the callback exists the row will have a hover
   * effect.
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => any;
}

/**
 * The EpicRow is the EpicTable's version of a <tr>. It has no inherent
 * behavior / UI of its own but is used to by the EpicTable to divide
 * the table into rows.
 *
 * When the row is a header the EpicTable will collect al subsequent
 * EpicRow's which are not headers underneath the header, until it
 * finds another EpicRow which is a header. This creates so called
 * sections.
 */
export function EpicRow({ children }: Props) {
  return <>{children}</>;
}
