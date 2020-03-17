/* istanbul ignore file */

// The EpicTable is really large and difficult to test via unit tests.
// Therefore there are a ton of stories for e2e testing instead. So
// that is why the EpicTable is ignored by istanbul.

import React, {
  Children,
  cloneElement,
  createElement,
  ReactElement
} from 'react';
import { isFragment } from 'react-is';

import { EpicExpanderRow } from '../../rows/EpicExpanderRow/EpicExpanderRow';
import { EpicDetailRow } from '../../rows/EpicDetailRow/EpicDetailRow';
import { EpicCell } from '../../cells/EpicCell/EpicCell';

export type EpicTableLayout = {
  /**
   * The layout sections that make up the left of the EpicTable
   */
  left: EpicTableLayoutSection[];

  /**
   * The layout sections that make up the right of the EpicTable
   */
  right?: EpicTableLayoutSection[];

  /**
   * The layout sections that make up the center of the EpicTable
   */
  center?: EpicTableLayoutSection[];

  /**
   * Is the combined width of the first center row the layout encounters,
   * as provided by the user. So if the user defines an EpicTable with
   * 5 columns of 100px each, the totalCenterWidth would be 300. Because
   * 500 pixels is the total desired width, minus 200px for the left
   * and right, which leaves 300 as the totalDesiredCenterWidth.
   *
   * The EpicTable needs to know this to determine if the desired width
   * can be met without the need for a center scrollbar. If so no shadows
   * are rendered.
   */
  totalDesiredCenterWidth: number;

  /**
   * Is the combined height of all first left cells the layout encounters,
   * as provided by the user. So if the user defines an EpicTable with
   * 5 rows of 100px each, the totalDesiredHeight would be 300.
   *
   * The EpicTable needs to know this to determine the actual height
   * to render the EpicTable at.
   */
  totalDesiredHeight: number;
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

type EpicTableLayoutConfig = {
  /**
   * The children to bucket
   */
  children: React.ReactNode;

  /**
   * The current rect of the epic table
   */
  epicTableRect: DOMRect | ClientRect | null;

  /**
   * Whether or not the epic-table has a sticky right.
   */
  hasRight: boolean;

  /**
   * Callback which receives active detail row.
   *
   * A detail row takes up the center and right when displayed and
   * the EpicTable needs to know this so it can determine if it
   * needs to render shadows.
   *
   * Also when the detail row is larger than the EpicTable the table
   * needs to become the height of the detail row.
   */
  activeDetailRowChanged: (detailRowRef: HTMLDivElement) => void;
};

/**
 * The user is given a semantic based API by the EpicTable. This api
 * for the user of the library feels very nice (at least that is the goal).
 *
 * Unfortunately the semantic UI is not a data structure which can be
 * used to render the table directly. The `epicTableLayout` therefore
 * takes the semantic UI and transforms it into a data structure which
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
 *
 * To bucket the rows it will hunt in the EpicTable's children for the
 * following rows: `EpicRow`, `EpicExpanderRow` and `EpicDetailRow`.
 * Each row type will be processed in a different way, see the helper
 * functions on how.
 */
export function epicTableLayout(
  config: EpicTableLayoutConfig
): EpicTableLayout {
  const { children, epicTableRect, hasRight, activeDetailRowChanged } = config;

  // Will contain all the first columns as sections.
  const left: EpicTableLayoutSection[] = [];

  // Will contain the middle columns as sections.
  const center: EpicTableLayoutSection[] = [];

  // Will contain all the last columns as sections.
  const right: EpicTableLayoutSection[] = [];

  let leftSection: EpicTableLayoutSection = { header: [], contents: [] };
  let centerSection: EpicTableLayoutSection = { header: [], contents: [] };
  let rightSection: EpicTableLayoutSection = { header: [], contents: [] };

  let totalDesiredCenterWidth = -1;
  let totalDesiredCenterHeight = -1;

  // Increases whenever an epic-row is encountered, used to determine
  // if the row is striped. Needs a separate counter because other
  // rows can be mixed with epic-row's.
  let epicRowNumber = 1;

  Children.forEach(getRows(children), (row: ReactElement) => {
    if (row.type === EpicExpanderRow && epicTableRect !== null) {
      return handleExpanderRow(row, epicTableRect);
    }

    if (row.type === EpicDetailRow && epicTableRect !== null) {
      return handleEpicDetailRow(row, epicTableRect);
    }

    handleEpicRow(row, epicRowNumber);
    epicRowNumber += 1;
  });

  left.push(leftSection);

  if (centerSection.header.length > 0 || centerSection.contents.length > 0) {
    center.push(centerSection);
  }

  if (rightSection.header.length > 0 || rightSection.contents.length > 0) {
    right.push(rightSection);
  }

  // Calculate the total desired height by looping through all left
  // headers and cells and sum their height
  const totalDesiredHeight = left.reduce((totalHeight, section) => {
    const header = section.header[0];

    if (header) {
      // @ts-ignore
      totalHeight += header.props.height;
    }

    const cellHeight = section.contents.reduce((cellsHeight, cells) => {
      const cell = cells[0];

      // @ts-ignore
      if (cell && cell.type === EpicCell) {
        // @ts-ignore
        return cellsHeight + cell.props.height;
      } else {
        // In this case the cell is an EpicDetailRow or
        // an EpicExpander spacer. We ignore these heights for now.
        // In case of the expander this is tricky but you should
        // not use expanders and details as the same time for now.
        return cellsHeight;
      }
    }, 0);

    return totalHeight + cellHeight;
  }, 0);

  return {
    left,
    center,
    right,
    totalDesiredCenterWidth,
    totalDesiredHeight
  };

  // Impure helper function for handling EpicRow's
  function handleEpicRow(row: any, index: number) {
    // The children of the row are the cells of the row.
    const cells = row.props.children;

    const lastCellInRowIndex = Children.count(cells) - 1;

    const isHeader = row.props.header;

    // When new header starts end the section and start a new one.
    if (isHeader) {
      if (leftSection !== null) {
        if (sectionHasData(leftSection)) {
          left.push(leftSection);
        }

        if (sectionHasData(centerSection)) {
          center.push(centerSection);
        }

        if (sectionHasData(rightSection)) {
          right.push(rightSection);
        }
      }

      // Reset for the next section.
      leftSection = { header: [], contents: [] };
      centerSection = { header: [], contents: [] };
      rightSection = { header: [], contents: [] };
      epicRowNumber = 1;
    }

    // These will contain all non header cells
    const leftRow: ReactElement[] = [];
    const centerRow: ReactElement[] = [];
    const rightRow: ReactElement[] = [];

    const isRowOdd = index % 2 === 1;

    // Put all cells in the correct bucket
    Children.forEach(cells, (cell: ReactElement, cellIndex) => {
      const left = cellIndex === 0;
      const right = hasRight && cellIndex === lastCellInRowIndex;

      const clone = cloneElement(cell, { odd: isRowOdd, key: cellIndex });

      // The first cell should be bucketed on the left
      if (left) {
        if (isHeader) {
          leftSection.header.push(clone);
        } else {
          leftRow.push(clone);
        }
      }
      // The last cell should be bucketed on the right, if there is a right
      else if (right) {
        if (isHeader) {
          rightSection.header.push(clone);
        } else {
          rightRow.push(clone);
        }
      }
      // All cells in the center (or when there is no right) should be
      // bucketed in the center.
      else {
        if (isHeader) {
          centerSection.header.push(clone);
        } else {
          centerRow.push(clone);
        }
      }
    });

    if (leftRow.length > 0) {
      leftSection.contents.push(leftRow);
    }

    if (centerRow.length > 0) {
      // Only calculate it once for the first center row encountered.
      if (totalDesiredCenterWidth === -1) {
        totalDesiredCenterWidth = centerRow.reduce((acc: number, cell) => {
          return acc + cell.props.width;
        }, 0);
      }

      if (totalDesiredCenterHeight === -1) {
        totalDesiredCenterHeight = centerRow.reduce((acc: number, cell) => {
          return acc + cell.props.width;
        }, 0);
      }

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
      key: 42,
      // @ts-ignore
      ref: activeDetailRowChanged
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
      // @ts-ignore
      // activeDetailRow = epicDetailRowRef;
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

function sectionHasData(section: EpicTableLayoutSection): boolean {
  return section.contents.length > 0 || section.header.length > 0;
}
