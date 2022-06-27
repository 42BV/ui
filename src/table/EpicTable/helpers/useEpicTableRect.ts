/* istanbul ignore file */

// The EpicTable is really large and difficult to test via unit tests.
// Therefore there are a ton of stories for e2e testing instead. So
// that is why the EpicTable is ignored by istanbul.

import { RefObject, useEffect, useState } from 'react';

export function useEpicTableRect(epicTableEl: RefObject<HTMLDivElement>) {
  const [ epicTableRect, setEpicTableRect ] = useState<DOMRect | ClientRect | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (epicTableEl.current) {
        const rect = epicTableEl.current.getBoundingClientRect();

        if (JSON.stringify(rect) !== JSON.stringify(epicTableRect)) {
          setEpicTableRect(rect);
        }
      }
    });
  });

  return epicTableRect;
}
