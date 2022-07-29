import React from 'react';

import { Button } from '../../../../core/Button/Button';

export type Props = {
  /**
   * Whether or not the expander is currently open.
   */
  open: boolean;

  /**
   * The callback for when the open state changes.
   */
  onChange: (open: boolean) => void;
};

/**
 * The EpicExpander is a button which can be used to open up an
 * EpicExpanderRow.
 */
export function EpicExpander({ open, onChange }: Props) {
  const icon = open ? 'expand_less' : 'expand_more';

  return <Button color="dark" icon={icon} onClick={() => onChange(!open)} />;
}
