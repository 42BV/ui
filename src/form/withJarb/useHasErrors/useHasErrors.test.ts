import React from 'react';
import { useHasErrors } from './useHasErrors';
import { renderHook } from '@testing-library/react-hooks';

test('return value', () => {
  const stateSpy = jest.spyOn(React, 'useState');

  const { unmount } = renderHook(() => useHasErrors());
  unmount();

  expect(stateSpy).toHaveBeenCalledTimes(1);
});
