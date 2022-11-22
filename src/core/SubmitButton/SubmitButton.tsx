import React from 'react';

import { Button } from '../Button/Button';
import { useScrollToClosestError } from './useScrollToClosestError';
import { ButtonProps } from '../types';

export type Props = {
  /**
   * Optionally whether to scroll to the closest error message.
   *
   * Defaults to `true`
   */
  scrollToClosestError?: boolean;
} & ButtonProps<React.ReactNode>;

/**
 * A SubmitButton is a Button with default 'save' icon and  a button
 * of type "submit". It will scroll to the closest error when
 * `scrollToClosestError` is `true` which it is by default.
 */
export function SubmitButton({
  children,
  inProgress,
  size,
  className = undefined,
  onClick,
  scrollToClosestError = true,
  icon = 'save'
}: Props) {
  const { doScrollToClosestError } = useScrollToClosestError({
    enabled: scrollToClosestError
  });

  function submitAndScrollToClosestError(event: React.MouseEvent<HTMLElement>) {
    doScrollToClosestError();

    if (onClick) {
      onClick(event);
    }
  }

  return (
    <Button
      type="submit"
      size={size}
      color="primary"
      inProgress={inProgress}
      className={className}
      onClick={submitAndScrollToClosestError}
      icon={icon}
    >
      {children}
    </Button>
  );
}
