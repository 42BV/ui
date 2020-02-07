import { useState } from 'react';

export function useActive() {
  return useState<string>();
}
