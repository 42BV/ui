import { useEffect } from 'react';
import { OnChange } from './types';

export function useOnChange(hasErrors: boolean, onChange?: OnChange) {
  useEffect(() => {
    if (onChange) {
      onChange(hasErrors);
    }
  }, [hasErrors, onChange]);
}
