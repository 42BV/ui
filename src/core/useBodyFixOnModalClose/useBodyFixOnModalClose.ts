/* istanbul ignore file */
import { useEffect } from 'react';

export function useBodyFixOnModalClose(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) {
      document.querySelector('body')?.classList.remove('modal-open');
    }
  }, [isOpen]);
}
