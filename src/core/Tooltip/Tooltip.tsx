import React, { CSSProperties } from 'react';
import * as Popper from 'popper.js';
import RCTooltip from 'rc-tooltip';
import { uniqueId } from 'lodash';

/*** Tooltip component based on the rc-tooltip Library ***/
type Props = {
  /**
   * Optionally the id of the tooltip content. Used for accessibility purposes.
   * Will be automatically filled in when not provided.
   */
  id?: string;

  /**
   * Target component that, when hovered, will trigger the tooltip to show up.
   * The target(children) of the tooltip are wrapped into a div.
   * This is a bypass to not have to forward the ref to the DOM node.
   */
  children: React.ReactNode;

  /**
   * Content shown inside the tooltip.
   */
  content: React.ReactNode;

  /**
   * Optional alignment relative to the target where the tooltip will be shown.
   */
  placement?: Popper.Placement;

  /**
   * Optional offset that the popover will show up relative from the target.
   */
  offset?: number;

  /**
   * Optional distance that the tooltip will show up relative from the target.
   */
  distance?: number;

  /**
   * Optional that allows you to override the default max width of the tooltip
   * Possible values: number (px), string (with units "rem") or string 'none'.
   */
  maxWidth?: number | string;

  /**
   * Optionally the tag wrapping the children.
   * Default value is a span.
   */
  tag?: 'span' | 'div';

  /**
   * Optional className that is added to the Wrapper component
   * Allowing you to add classes like margins and padding that would otherwise get lost
   * by the wrapping of the children inside the CustomTag.
   */
  className?: string;

  /**
   * Optional CSS properties that are added to the Wrapper component
   * Allowing you to add CSS properties that would otherwise get lost
   * by the wrapping of the children inside the CustomTag.
   */
  style?: CSSProperties;
};

/**
 * Bootstrap-like Tooltip component based on the rc-tooltip library.
 */
export function Tooltip({
  id = uniqueId(),
  children,
  placement = 'top',
  content,
  offset = 0,
  distance = 7,
  maxWidth = 350,
  tag = 'span',
  className,
  style
}: Props) {
  const Tag = tag;

  return (
    <RCTooltip
      id={id}
      overlay={content}
      placement={placement}
      align={{ offset: [ offset, distance ] }}
      overlayStyle={{ maxWidth }}
      destroyTooltipOnHide={true}
    >
      <Tag className={className} style={{ outline: 0, ...style }} tabIndex={0} role="button" aria-describedby={id}>
        {children}
      </Tag>
    </RCTooltip>
  );
}
