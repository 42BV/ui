import { useState } from 'react';

export function useIsModalOpen() {
  return useState(false);
}
