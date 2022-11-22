import { useEffect, useState } from 'react';

/**
 * xs: for all screen size below 576 px.
 * sm: for larger mobile phones (devices with resolutions ≥ 576px).
 * md: for tablets (devices with resolutions ≥ 768px).
 * lg: for laptops (devices with resolutions ≥ 992px).
 * xl: for desktops (devices with resolutions ≥ 1200px)
 * xxl: for larger desktops (devices with resolutions ≥ 1400px)
 */
export type BootstrapSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type BootstrapInfo = {
  bootstrapSize: BootstrapSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

/**
 * This hook returns the bootstrap size that is based on the screen width breakpoints.
 *
 * if a component needs to render differently on mobile in comparison to desktop,
 * this hook can help.
 *
 * @example:
 * ```tsx
 * function ComponentWithMobile() {
 *  const { isMobile } = useBootstrapSize();
 *
 *  // Other hooks/functions
 *
 *  if (isMobile) {
 *    return (
 *      // Render for mobile
 *    )
 *  }
 *
 *  return (
 *    // Render for desktop
 *  )
 * }
 * ```
 */
export function useBootstrapSize(): BootstrapInfo {
  const [bootstrapSize, setBootstrapSize] = useState(
    getBootstrapSize(window.innerWidth)
  );

  useEffect(() => {
    window.addEventListener('resize', updateWindowDimensions);

    return () => window.removeEventListener('resize', updateWindowDimensions);
  });

  function updateWindowDimensions() {
    setBootstrapSize(getBootstrapSize(window.innerWidth));
  }

  return {
    bootstrapSize,
    isMobile: isMobile(bootstrapSize),
    isTablet: isTablet(bootstrapSize),
    isDesktop: isDesktop(bootstrapSize)
  };
}

function isMobile(size: BootstrapSize) {
  return ['xs', 'sm'].includes(size);
}

function isTablet(size: BootstrapSize) {
  return ['md'].includes(size);
}

function isDesktop(size: BootstrapSize) {
  return ['lg', 'xl', 'xxl'].includes(size);
}

function getBootstrapSize(width: number): BootstrapSize {
  if (width < 576) {
    return 'xs';
  } else if (width >= 576 && width < 768) {
    return 'sm';
  } else if (width >= 768 && width < 992) {
    return 'md';
  } else if (width >= 992 && width < 1200) {
    return 'lg';
  } else if (width >= 1200 && width < 1400) {
    return 'xl';
  } else {
    return 'xxl';
  }
}
