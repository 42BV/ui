import { useState } from 'react';

export function useSetLastStringValue() {
  return useState('');
}
