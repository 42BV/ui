/* istanbul ignore file */

// The EpicTable is really large and difficult to test via unit tests.
// Therefore there are a ton of stories for e2e testing instead. So
// that is why the EpicTable is ignored by istanbul.

import { Children, cloneElement, createElement, ReactElement } from 'react';
import { isFragment } from 'react-is';

import { EpicExpanderRow } from '../../rows/EpicExpanderRow/EpicExpanderRow';
import { EpicDetailRow } from '../../rows/EpicDetailRow/EpicDetailRow';

export type EpicTableLayout = {
  left: EpicTableLayoutSection[];
  right?: EpicTableLayoutSection[];
  center?: EpicTableLayoutSection[];
  containsActiveDetailRow: boolean;
};

/**
 * A section has headers which scrolls with the user.
 * and contents which are rows belonging to that section.
 */
type EpicTableLayoutSection = {
  // Contains EpicHeader cells
  header: React.ReactNode[];
  // Contains rows which are arrays which contain Cell's
  contents: React.ReactNode[][];
};

/**
 * The user is given a semantic based API by the EpicTable. This api
 * for the user of the library feels very nice (at least that is the goal).
 *
 * Unfortunately the semantic UI is not a datastructure which can be
 * used to render the table directly. The `epicTableLayout` therefore
 * takes the semantic UI and transforms it into a datastructure which
 * can actually be rendered.
 *
 * The problem is this: to create a fixed left, a gooey center and
 * a fixed right, you need three <div>`s next to each other. One
 * job of the `epicTableLayout` is to bucket the semantic structure
 * in a left, right and center.
 *
 * So given this structure:
 *
 * ```tsx
 *  <EpicTable>
 *    <EpicRow header>
 *      <EpicHeader width={300} height={44}>
 *        Name
 *      </EpicHeader>
 *      <EpicHeader width={100} height={44}>
 *        Age
 *      </EpicHeader>
 *      <EpicHeader width={100} height={44}>
 *        Eye color
 *      </EpicHeader>
 *      <EpicHeader width={300} height={44}>
 *        Actions
 *      </EpicHeader>
 *    </EpicRow>
 *    <EpicRow>
 *      <EpicCell width={300} height={44}>
 *        Maarten
 *      </EpicCell>
 *      <EpicCell width={100} height={44}>
 *        30
 *      </EpicCell>
 *      <EpicCell width={100} height={44}>
 *        Brown
 *      </EpicCell>
 *      <EpicCell width={300} height={44}>
 *        <Button icon="delete" /> <Button icon="edit" />
 *      </EpicCell>
 *    </EpicRow>
 *     <EpicRow>
 *      <EpicCell width={300} height={44}>
 *        Jeffrey
 *      </EpicCell>
 *      <EpicCell width={100} height={44}>
 *        28
 *      </EpicCell>
 *      <EpicCell width={100} height={44}>
 *        Greenish
 *      </EpicCell>
 *      <EpicCell width={300} height={44}>
 *        <Button icon="delete" /> <Button icon="edit" />
 *      </EpicCell>
 *    </EpicRow>
 *  </EpicTable>;
 * ```
 * It should create the following EpicTableLayout:
 *
 * ```tsx
 * {
 *   containsActiveDetailRow: false,
 *   left: [{
 *     header: [(
 *       <EpicHeader width={300} height={44}>
 *         Name
 *       </EpicHeader>
 *     )],
 *     contents: [[(
 *       <EpicCell width={300} height={44}>
 *         Maarten
 *       </EpicCell>
 *     )], [(
 *       <EpicCell width={300} height={44}>
 *         Jeffrey
 *       </EpicCell>
 *     )]]
 *   }],
 *   center: [{
 *     headers: [(
 *       <EpicHeader width={100} height={44}>
 *         Age
 *       </EpicHeader>
 *     ), (
 *       <EpicHeader width={100} height={44}>
 *         Eye color
 *       </EpicHeader>
 *     )]
 *     contents: [[(
 *       <EpicCell width={100} height={44}>
 *          30
 *        </EpicCell>
 *     ), (
 *       <EpicCell width={100} height={44}>
 *          Brown
 *       </EpicCell>
 *     )], [(
 *       <EpicCell width={100} height={44}>
 *          28
 *        </EpicCell>
 *     ), (
 *       <EpicCell width={100} height={44}>
 *          Greenish
 *       </EpicCell>
 *     )]]
 *   }],
 *   right: [{
 *     header: [(
 *       <EpicHeader width={300} height={44}>
 *         Actions
 *       </EpicHeader>
 *     )],
 *     contents: [[(
 *       <EpicCell width={300} height={44}>
 *         <Button icon="delete" /> <Button icon="edit" />
 *       </EpicCell>
 *     )], [(
 *       <EpicCell width={300} height={44}>
 *         <Button icon="delete" /> <Button icon="edit" />
 *       </EpicCell>
 *     )]]
 *   }]
 * }
 * ```
 *
 * To bucket the rows it will hunt in the EpicTable's children for the
 * following rows: `EpicRow`, `EpicExpanderRow` and `EpicDetailRow`.
 * Each row type will be processed in a different way, see the helper
 * functions on how.
 */
export function epicTableLayout(
  children: React.ReactNode,
  rect: DOMRect | ClientRect | null,
  hasRight: boolean
): EpicTableLayout {
  // Will contain all the first columns as sections.
  const left: EpicTableLayoutSection[] = [];

  // Will contain the middle columns as sections.
  const center: EpicTableLayoutSection[] = [];

  // Will contain all the last columns as sections.
  const right: EpicTableLayoutSection[] = [];

  let leftSection: EpicTableLayoutSection = { header: [], contents: [] };
  let centerSection: EpicTableLayoutSection = { header: [], contents: [] };
  let rightSection: EpicTableLayoutSection = { header: [], contents: [] };

  // When there is an active detail row the EpicTable needs to know
  // so it renders the shadows properly.
  let containsActiveDetailRow = false;

  Children.forEach(getRows(children), (row: ReactElement, index) => {
    if (row.type === EpicExpanderRow && rect !== null) {
      return handleExpanderRow(row, rect);
    }

    if (row.type === EpicDetailRow && rect !== null) {
      return handleEpicDetailRow(row, rect);
    }

    handleEpicRow(row, index);
  });

  left.push(leftSection);

  if (centerSection.header.length > 0 || centerSection.contents.length > 0) {
    center.push(centerSection);
  }

  if (rightSection.header.length > 0 || rightSection.contents.length > 0) {
    right.push(rightSection);
  }

  return { left, center, right, containsActiveDetailRow };

  // Impure helper function for handling EpicRow's
  function handleEpicRow(row: any, index: number) {
    // The children of the row are the cells of the row.
    const cells = row.props.children;

    const lastCellInRowIndex = Children.count(cells) - 1;

    const isHeader = row.props.header;

    // When new header starts end the section and start a new one.
    if (isHeader && index !== 0) {
      if (leftSection !== null) {
        left.push(leftSection);

        if (
          centerSection.header.length > 0 ||
          centerSection.contents.length > 0
        ) {
          center.push(centerSection);
        }

        if (
          rightSection.header.length > 0 ||
          rightSection.contents.length > 0
        ) {
          right.push(rightSection);
        }
      }

      // Reset for the next section.
      leftSection = { header: [], contents: [] };
      centerSection = { header: [], contents: [] };
      rightSection = { header: [], contents: [] };
    }

    // These will contain all non header cells
    const leftRow: ReactElement[] = [];
    const centerRow: ReactElement[] = [];
    const rightRow: ReactElement[] = [];

    // Put all cells in the correct bucket
    Children.forEach(cells, (cell: ReactElement, cellIndex) => {
      // The first cell should be bucketed on the left
      if (cellIndex === 0) {
        if (isHeader) {
          leftSection.header.push(cell);
        } else {
          leftRow.push(cell);
        }
      }
      // The last cell should be bucketed on the right, if there is a right
      else if (hasRight && cellIndex === lastCellInRowIndex) {
        if (isHeader) {
          rightSection.header.push(cell);
        } else {
          rightRow.push(cell);
        }
      }
      // All cells in the center (or when there is no right) should be
      // bucketed in the center.
      else {
        if (isHeader) {
          centerSection.header.push(cell);
        } else {
          centerRow.push(cell);
        }
      }
    });

    leftSection.contents.push(leftRow);

    if (centerRow.length > 0) {
      centerSection.contents.push(centerRow);
    }

    if (rightRow.length > 0) {
      rightSection.contents.push(rightRow);
    }
  }

  // Impure helper function for handling EpicDetailRow's
  function handleEpicDetailRow(row: any, rect: DOMRect | ClientRect) {
    // Clone the element because we are injecting extra props.
    const clone = cloneElement(row, {
      width: rect.width - row.props.left,
      top: 0,
      left: row.props.left,
      height: rect.height,
      key: 42
    });

    // Now add the detail row on the left section. Even thought it
    // is only added on the left, it will actually not be displayed
    // on the left but instead it will cover the entire EpicTable
    // sans the `left` property of the `EpicDetailRow`
    // It needs to be added somewhere :P so why not on the left
    leftSection.contents.push([clone]);

    // When the EpicDetailRow is active, report it back to the
    // EpicTable so it can set the shadows correctly.
    if (row.props.active === true) {
      containsActiveDetailRow = true;
    }
  }

  // Impure helper function for handling ExpanderRow's
  function handleExpanderRow(row: any, rect: DOMRect | ClientRect) {
    // Clone the element because we are injecting extra props.
    const clone = cloneElement(row, { width: rect.width, key: 1337 });

    // Now add the expander row on the left section. Even thought it
    // is only added on the left, it will take up the space of the
    // center and right as well because it is as large as the width
    // of the rect.
    // It needs to be added somewhere :P so why not on the left
    leftSection.contents.push([clone]);

    if (row.props.active) {
      // Whenever the ExpanderRow is active, we need to add a fake
      // row which pushes all other rows down. This is achieved by
      // pushing in div's with the same height as the ExpanderRow.
      // If we do not add the spacer, it will overlap existing rows
      // and the user cannot see them anymore.
      const spacer = createElement('div', {
        style: { height: row.props.height }
      });

      leftSection.contents.push([cloneElement(spacer, { key: 1 })]);
      rightSection.contents.push([cloneElement(spacer, { key: 2 })]);
      centerSection.contents.push([cloneElement(spacer, { key: 3 })]);
    }
  }
}

// Function which gathers all Row's inside of the EpicTable.
// Also unpacks fragments at one level deep to help the user map
// over array's
export function getRows(children: any): ReactElement[] {
  const rows: ReactElement[] = [];

  Children.forEach(children, (child: ReactElement) => {
    if (isFragment(child)) {
      child.props.children.forEach((row: ReactElement) => {
        rows.push(row);
      });
    } else {
      rows.push(child);
    }
  });

  return rows;
}
