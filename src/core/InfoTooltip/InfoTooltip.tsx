import React from 'react';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip/Tooltip';
import { ToolTipProps, WithSize, WithValue } from '../types';

type Props = Partial<
  ToolTipProps & WithSize<number> & WithValue<React.ReactNode>
>;

/**
 * InfoTooltip is an info icon that displays a tooltip on mouseover.
 */
export function InfoTooltip(props: Props) {
  const { value, size = 16, className } = props;
  return (
    <Tooltip content={value} className={className}>
      <Icon icon="info" size={size} />
    </Tooltip>
  );
}
