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

    expect(setComponentOverflowSpy).toHaveBeenCalledTimes(0);

    ref.current = document.createElement('div');

    useComponentOverflow.handleResizeCallback(ref, setComponentOverflowSpy)();
    expect(setComponentOverflowSpy).toHaveBeenCalledTimes(1);
    expect(setComponentOverflowSpy).toHaveBeenCalledWith(false);
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
      expect(handleResizeSpy).toHaveBeenCalledTimes(0);
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

      expect(handleResizeSpy).toHaveBeenCalledTimes(1);
      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        handleResizeSpy,
        {
          passive: true
        }
      );

      // @ts-expect-error Test mock
      eventListenerResult();

      expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        handleResizeSpy
      );
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

      expect(handleResizeSpy).toHaveBeenCalledTimes(1);
      expect(observeSpy).toHaveBeenCalledTimes(1);
      expect(observeSpy).toHaveBeenCalledWith(ref.current);
      expect(addEventListenerSpy).toHaveBeenCalledTimes(0);

      // @ts-expect-error Test mock
      resizeObserverResult();

      expect(unobserveSpy).toHaveBeenCalledTimes(1);
      expect(unobserveSpy).toHaveBeenCalledWith(ref.current);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(0);
    });
  });
});
