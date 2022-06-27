import * as useComponentOverflow from './useComponentOverflow';

describe('HoC: useComponentOverflow', () => {
  test('isOverflowing', () => {
    expect(
      useComponentOverflow.isOverflowing({
        clientWidth: 50,
        scrollWidth: 50
      } as HTMLElement)
    ).toBe(false);

    expect(
      useComponentOverflow.isOverflowing({
        clientWidth: 50,
        scrollWidth: 100
      } as HTMLElement)
    ).toBe(true);
  });

  test('handleResizeCallback', () => {
    const ref = { current: null } as { current: HTMLElement | null };
    const setComponentOverflowSpy = jest.fn();

    useComponentOverflow.handleResizeCallback(ref, setComponentOverflowSpy)();

    expect(setComponentOverflowSpy).toBeCalledTimes(0);

    ref.current = document.createElement('div');

    useComponentOverflow.handleResizeCallback(ref, setComponentOverflowSpy)();
    expect(setComponentOverflowSpy).toBeCalledTimes(1);
    expect(setComponentOverflowSpy).toBeCalledWith(false);
  });

  describe('layoutEffect', () => {
    const ref = { current: null } as { current: HTMLElement | null };
    const handleResizeSpy = jest.fn();
    const addEventListenerSpy = jest.fn();
    const removeEventListenerSpy = jest.fn();

    afterEach(() => {
      handleResizeSpy.mockReset();
      addEventListenerSpy.mockReset();
      removeEventListenerSpy.mockReset();
    });

    it('should not call handleResize when ref is empty', () => {
      useComponentOverflow.layoutEffect(ref, handleResizeSpy, undefined)();
      expect(handleResizeSpy).toBeCalledTimes(0);
    });

    it('should call addEventListener and removeEventListener when resizeObserver is not defined', () => {
      ref.current = Object.assign(
        {
          addEventListener: addEventListenerSpy,
          removeEventListener: removeEventListenerSpy
        },
        document.createElement('div')
      );

      const eventListenerResult = useComponentOverflow.layoutEffect(
        ref,
        handleResizeSpy,
        undefined
      )();

      expect(handleResizeSpy).toBeCalledTimes(1);
      expect(addEventListenerSpy).toBeCalledTimes(1);
      expect(addEventListenerSpy).toBeCalledWith('resize', handleResizeSpy, {
        passive: true
      });

      // @ts-expect-error Test mock
      eventListenerResult();

      expect(removeEventListenerSpy).toBeCalledTimes(1);
      expect(removeEventListenerSpy).toBeCalledWith('resize', handleResizeSpy);
      removeEventListenerSpy.mockReset();
    });

    it('should use resizeObserver when defined', () => {
      ref.current = Object.assign(
        {
          addEventListener: addEventListenerSpy,
          removeEventListener: removeEventListenerSpy
        },
        document.createElement('div')
      );

      const observeSpy = jest.fn();
      const unobserveSpy = jest.fn();

      const resizeObserverResult = useComponentOverflow.layoutEffect(
        ref,
        handleResizeSpy,
        { observe: observeSpy, unobserve: unobserveSpy }
      )();

      expect(handleResizeSpy).toBeCalledTimes(1);
      expect(observeSpy).toBeCalledTimes(1);
      expect(observeSpy).toBeCalledWith(ref.current);
      expect(addEventListenerSpy).toBeCalledTimes(0);

      // @ts-expect-error Test mock
      resizeObserverResult();

      expect(unobserveSpy).toBeCalledTimes(1);
      expect(unobserveSpy).toBeCalledWith(ref.current);
      expect(removeEventListenerSpy).toBeCalledTimes(0);
    });
  });
});
