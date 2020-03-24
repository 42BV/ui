import { useState } from 'react';

export function useHasFormatError() {
  return useState(false);
}
