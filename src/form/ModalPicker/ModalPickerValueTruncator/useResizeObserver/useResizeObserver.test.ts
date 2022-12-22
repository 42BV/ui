import { vi } from 'vitest';
import * as useResizeObserver from './useResizeObserver';
import { setResizeObserver } from './utils';

describe('HoC: useResizeObserver', () => {
  test('ResizeObserver', () => {
    const entries = [
      document.createElement('div'),
      document.createElement('div')
    ];
    const resizeObserverSpy = vi.fn((fn: (entries: any[]) => void) => {
      return { fire: (entries: any[]) => fn(entries) };
    });
    const handleResizeSpy = vi.fn();

    const oldResizeObserver = setResizeObserver(resizeObserverSpy);

    // @ts-expect-error Test mock
    useResizeObserver.useResizeObserver(handleResizeSpy).fire(entries);

    expect(resizeObserverSpy).toBeCalledTimes(1);

    expect(handleResizeSpy).toBeCalledTimes(2);
    expect(handleResizeSpy).toHaveBeenNthCalledWith(1, entries[0], 0, entries);
    expect(handleResizeSpy).toHaveBeenNthCalledWith(2, entries[1], 1, entries);

    setResizeObserver(oldResizeObserver);
  });
});
