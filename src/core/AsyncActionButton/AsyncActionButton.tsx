import React, { useState } from 'react';

import { Button, Props as ButtonProps } from '../Button/Button';

export type Props = Omit<ButtonProps, 'onClick' | 'inProgress'> & {
  /**
   * Callback that is triggered when the button is clicked.
   * This callback should return a request promise.
   */
  action: () => Promise<unknown>;
};

/**
 * The AsyncActionButton is a button that triggers a request when it is
 * clicked and is disabled until the request is finished. This button should
 * be used to trigger resource-heavy actions that should not be triggered
 * multiple times asynchronously.
 */
export function AsyncActionButton({ action, children, ...buttonProps }: Props) {
  const [ inProgress, setInProgress ] = useState(false);

  async function onClick() {
    setInProgress(true);

    try {
      await action();
      setInProgress(false);
    } catch {
      setInProgress(false);
    }
  }

  return (
    <Button onClick={onClick} inProgress={inProgress} {...buttonProps}>
      {children}
    </Button>
  );
}
