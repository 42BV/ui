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
