import { useBootstrapSize } from './useBootstrapSize';
import { act, renderHook } from '@testing-library/react';

describe('useBootstrapSize', () => {
  it('should return xs and mobile true when window width less than 576 pixels', () => {
    // noinspection JSConstantReassignment
    global.innerWidth = 500;

    const { result } = renderHook(() => useBootstrapSize());

    expect(result.current).toEqual({
      bootstrapSize: 'xs',
      isMobile: true,
      isTablet: false,
      isDesktop: false
    });
  });

  it('should return sm and mobile true when window width between 576 and 768 pixels', () => {
    // noinspection JSConstantReassignment
    global.innerWidth = 600;

    const { result } = renderHook(() => useBootstrapSize());

    expect(result.current).toEqual({
      bootstrapSize: 'sm',
      isMobile: true,
      isTablet: false,
      isDesktop: false
    });
  });

  it('should return md and tablet true when window width between 768 and 992 pixels', () => {
    // noinspection JSConstantReassignment
    global.innerWidth = 800;

    const { result } = renderHook(() => useBootstrapSize());

    expect(result.current).toEqual({
      bootstrapSize: 'md',
      isMobile: false,
      isTablet: true,
      isDesktop: false
    });
  });

  it('should return lg and desktop true when window width between 992 and 1200 pixels', () => {
    // noinspection JSConstantReassignment
    global.innerWidth = 1100;

    const { result } = renderHook(() => useBootstrapSize());

    expect(result.current).toEqual({
      bootstrapSize: 'lg',
      isMobile: false,
      isTablet: false,
      isDesktop: true
    });
  });

  it('should return xl and desktop true when window width more than 1200 pixels', () => {
    // noinspection JSConstantReassignment
    global.innerWidth = 1300;

    const { result } = renderHook(() => useBootstrapSize());

    expect(result.current).toEqual({
      bootstrapSize: 'xl',
      isMobile: false,
      isTablet: false,
      isDesktop: true
    });
  });

  it('should return xxl and desktop true when window width more than 1400 pixels', () => {
    // noinspection JSConstantReassignment
    global.innerWidth = 1600;

    const { result } = renderHook(() => useBootstrapSize());

    expect(result.current).toEqual({
      bootstrapSize: 'xxl',
      isMobile: false,
      isTablet: false,
      isDesktop: true
    });
  });

  describe('events', () => {
    it('should change bootstrap size when screen is resized passed breakpoints', () => {
      // noinspection JSConstantReassignment
      global.innerWidth = 1024;

      const { result } = renderHook(() => useBootstrapSize());

      expect(result.current).toEqual({
        bootstrapSize: 'lg',
        isMobile: false,
        isTablet: false,
        isDesktop: true
      });

      act(() => {
        // noinspection JSConstantReassignment
        global.innerWidth = 768;
        global.dispatchEvent(new Event('resize'));
      });

      expect(result.current).toEqual({
        bootstrapSize: 'md',
        isMobile: false,
        isTablet: true,
        isDesktop: false
      });
    });
  });
});
