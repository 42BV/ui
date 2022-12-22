import React from 'react';
import { useHasErrors } from './useHasErrors';
import { renderHook } from '@testing-library/react';

test.skip('return value', () => {
  const stateSpy = vi.spyOn(React, 'useState');

  const { unmount } = renderHook(() => useHasErrors());
  unmount();

  expect(stateSpy).toHaveBeenCalledTimes(1);
});
