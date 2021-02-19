/* istanbul ignore file */
import { useEffect } from 'react';

/**
 * @deprecated Please do not use this hook anymore. Reactstrap fixed
 * the problem that we tried to temporarily fix with this hook.
 * In version 4.0.0 the useBodyFixOnModalClose hook will be removed.
 */
export function useBodyFixOnModalClose(isOpen: boolean): void {
  useEffect(() => {
    if (!isOpen) {
      document.querySelector('body')?.classList.remove('modal-open');
    }
  }, [isOpen]);
}
