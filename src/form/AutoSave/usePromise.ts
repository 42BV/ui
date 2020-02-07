import { useRef } from 'react';

export function usePromise<T>() {
  return useRef<Promise<T>>();
}
