/* istanbul ignore file */

// The EpicTable is really large and difficult to test via unit tests.
// Therefore, there are a ton of stories for e2e testing instead. So
// that is why the EpicTable is ignored by istanbul.

import { useEffect, useState } from 'react';

type CalculateActualHeightConfig = {
  minHeight: number;
  totalDesiredHeight: number;
  activeDetailRow: HTMLDivElement | null;
  overlayEl: HTMLDivElement | null;
  headerHeight: number;
};

/**
 * Calculates the height of the EpicTable. Taking into account
 * the existence of an active EpicDetailRow or overlay.
 *
 * When an EpicDetailRow exists it may be larger than the actual
 * EpicTable. So we increase the height of the EpicTable in that
 * case to be the height of the EpicDetailRow.
 *
 * Also, the minHeight can be lower than the totalDesiredHeight. In
 * that case the totalDesiredHeight should be used instead. As the
 * minHeight is merely a suggestion.
 */
export function useCalculateActualHeight({
  minHeight,
  totalDesiredHeight,
  activeDetailRow,
  overlayEl,
  headerHeight
}: CalculateActualHeightConfig) {
  const [actualHeight, setActualHeight] = useState(minHeight);
  useEffect(() => {
    function resize() {
      const detailRowHeight = activeDetailRow
        ? activeDetailRow.scrollHeight
        : 0;

      const overlayHeight = overlayEl
        ? overlayEl.scrollHeight + headerHeight
        : 0;

      const height = Math.max(
        minHeight,
        detailRowHeight,
        totalDesiredHeight,
        overlayHeight
      );
      setActualHeight(height);
    }

    /*
      When there is an active DetailRow then resize the content
      after every 20 milliseconds. This needs to be done so that
      when the DetailRow becomes larger after it has been rendered
      the EpicTable scales with it.
 
      Unfortunately when the detail row becomes smaller later on we
      lose the ability to shrink the detail row. This is because when
      we set the `style.height` of the detail row we cannot access
      the needed size again via the `scrollHeight`.
    */
    let interval = -1;
    if (activeDetailRow) {
      interval = window.setInterval(resize, 20);
    }

    resize();

    return () => {
      window.clearInterval(interval);
    };
  }, [minHeight, totalDesiredHeight, activeDetailRow, overlayEl, headerHeight]);

  return actualHeight;
}
