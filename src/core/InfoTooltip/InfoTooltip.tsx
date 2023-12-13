import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip/Tooltip';
import { ReactNode } from 'react';

type Props = {
  /**
   * The content of the tooltip.
   */
  tooltip: ReactNode;

  /**
   * Optionally the size of the icon.
   * Defaults to 16.
   */
  size?: number;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

/**
 * InfoTooltip is an info icon that displays a tooltip on mouseover.
 */
export function InfoTooltip(props: Props) {
  const { tooltip, size = 16, className } = props;
  return (
    <Tooltip content={tooltip} className={className}>
      <Icon icon="info" size={size} />
    </Tooltip>
  );
}
