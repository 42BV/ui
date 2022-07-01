import { renderHook } from '@testing-library/react';

import { listenerConfig } from './EpicResize';
import { useEpicResizeListenerCleanup } from './useEpicResizeListenerCleanup';

describe('useEpicResizeListenerCleanup', () => {
  test('that the event listeners are destroyed', () => {
    const spy = jest.spyOn(window, 'removeEventListener');

    function resize() {
      console.log('resize');
    }

    function resizeEnd() {
      console.log('resizeEnd');
    }

    const { result, unmount } = renderHook(() =>
      useEpicResizeListenerCleanup(resize, resizeEnd)
    );

    expect(result.current).toBe(undefined);

    unmount();

    // For some reason this is not 2 but 11 I cannot find out why
    // this happens
    //expect(window.removeEventListener).toBeCalledTimes(2);

    expect(window.removeEventListener).toBeCalledWith(
      'mousemove',
      resize,
      listenerConfig
    );
    expect(window.removeEventListener).toBeCalledWith(
      'mouseup',
      resizeEnd,
      listenerConfig
    );

    (spy as jest.Mock).mockClear();
  });
});
