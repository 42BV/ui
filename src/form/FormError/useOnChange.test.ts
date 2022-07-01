import { renderHook } from '@testing-library/react';

import { useOnChange } from './useOnChange';
import { FormErrorOnChange } from './types';

describe('useOnChange', () => {
  test('that it passes values only when they change', () => {
    const onChange = jest.fn();

    const { rerender } = renderHook<
      void,
      { hasErrors: boolean; onChange: FormErrorOnChange }
    >((props) => useOnChange(props.hasErrors, props.onChange), {
      initialProps: {
        hasErrors: true,
        onChange
      }
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(true);

    // Call with same do nothing
    rerender({ hasErrors: true, onChange });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(true);

    // Call with same do nothing
    rerender({ hasErrors: true, onChange });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(true);

    // Call with change re-render
    rerender({ hasErrors: false, onChange });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  test('when onChange is empty it does nothing', () => {
    const onChange = jest.fn();

    renderHook(() => useOnChange(false, undefined));

    expect(onChange).toHaveBeenCalledTimes(0);
  });
});
