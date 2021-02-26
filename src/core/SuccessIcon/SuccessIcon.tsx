import React from 'react';
import Icon from '../Icon/Icon';

type Props = {
  /**
   * Whether or not the process succeeded.
   */
  value: boolean;
};

/**
 * SuccessIcon is used to display whether a process succeeded or not
 * based on a boolean value.
 */
export function SuccessIcon({ value }: Props) {
  const icon = value ? 'done' : 'clear';

  return <Icon icon={icon} color="dark" />;
}
