import { useEffect } from 'react';
import { OnChange } from './types';

export function useOnChange(hasErrors: boolean, onChange?: OnChange): void {
  useEffect(() => {
    if (onChange) {
      onChange(hasErrors);
    }
  }, [hasErrors, onChange]);
}
