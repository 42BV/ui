import React, { useState } from 'react';

import { Button } from '../Button/Button';
import { ButtonProps } from '../types';

type AsyncActionButtonProps<T> = {
  action: () => Promise<T>;
} & ButtonProps<React.ReactNode>;

/**
 * The AsyncActionButton is a button that triggers a request when it is clicked and is disabled until the request is
 * finished. This button should be used to trigger resource-heavy actions that should not be triggered multiple times
 * asynchronously. The AsyncActionButton holds a callback-property, which should return a Promise. The callback-function
 * must be passed by the implementation.
 */
export function AsyncActionButton<T>({
  action,
  children,
  ...props
}: AsyncActionButtonProps<T>) {
  const [inProgress, setInProgress] = useState(false);

  async function onClick(): Promise<void> {
    setInProgress(true);
    try {
      await action();
    } catch (err) {
    } finally {
      setInProgress(false);
    }
  }

  return (
    <Button onClick={onClick} inProgress={inProgress} {...props}>
      {children}
    </Button>
  );
}
