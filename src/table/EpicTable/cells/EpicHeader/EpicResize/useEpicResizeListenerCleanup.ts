import { useEffect } from 'react';

import { listenerConfig } from './ListenerConfig';

export function useEpicResizeListenerCleanup(
  resize: (event: MouseEvent) => void,
  resizeEnd: (event: MouseEvent) => void
) {
  // Remove any event listeners still dangling when the EpicResize is
  // re-rendered to prevent memory leaks.
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', resize, listenerConfig);
      window.removeEventListener('mouseup', resizeEnd, listenerConfig);
    };
  }, [resize, resizeEnd]);
}
