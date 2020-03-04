import { useState } from 'react';

export function useHasErrors() {
  return useState(false);
}
