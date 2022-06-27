/* istanbul ignore file */

// The EpicTable is really large and difficult to test via unit tests.
// Therefore there are a ton of stories for e2e testing instead. So
// that is why the EpicTable is ignored by istanbul.

import { useEffect } from 'react';

type AdjustHeightOfActiveDetailRowConfig = {
  activeDetailRow: HTMLDivElement | null;
  actualHeight: number;
};

/**
 * Changes the height of the detailRow so it always fills up the to
 * the height of the EpicTable.
 */
export function useAdjustHeightOfActiveDetailRow({
  activeDetailRow,
  actualHeight
}: AdjustHeightOfActiveDetailRowConfig) {
  useEffect(() => {
    if (activeDetailRow) {
      activeDetailRow.style.height = `${actualHeight}px`;
    }
  }, [ actualHeight, activeDetailRow ]);
}
