import { useEffect } from 'react';
import { FormErrorOnChange } from './types';

export function useOnChange(
  hasErrors: boolean,
  onChange?: FormErrorOnChange
): void {
  useEffect(() => {
    if (onChange) {
      onChange(hasErrors);
    }
  }, [ hasErrors, onChange ]);
}
