/* istanbul ignore file */

// The EpicTable is really large and difficult to test via unit tests.
// Therefore, there are a ton of stories for e2e testing instead. So
// that is why the EpicTable is ignored by istanbul.

import { RefObject, useEffect, useState } from 'react';
import { HeaderRef } from '../../types';

/**
 * Calculates which header is rendered closest to the FixedHeader by
 * index
 *
 * Used to determine which header the FixedHeader should take as
 * its appearance.
 */
export function useClosestHeaderIndex(
  fixedHeaderEl: RefObject<HTMLDivElement>,
  headers: HeaderRef[]
) {
  const [ index, setIndex ] = useState(-1);

  useEffect(() => {
    function onScroll() {
      if (fixedHeaderEl.current && headers.length > 0) {
        const fakeRect = fixedHeaderEl.current.getBoundingClientRect();

        const headersAboveFakeHeader = headers.filter(({ ref }) => {
          const headerRect = ref.getBoundingClientRect();

          return fakeRect.bottom > headerRect.bottom;
        });

        if (headersAboveFakeHeader && headersAboveFakeHeader.length > 0) {
          const lastIndex = headersAboveFakeHeader.length - 1;

          setIndex(
            headersAboveFakeHeader[lastIndex].index
          );
        } else {
          setIndex(-1);
        }
      }
    }

    window.addEventListener('scroll', onScroll, true);

    return () => {
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [ fixedHeaderEl, headers ]);

  return index;
}
