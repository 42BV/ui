import React, { CSSProperties } from 'react';
import * as Popper from 'popper.js';
import Tippy from '@tippyjs/react';

/*** Tooltip component based on the Tippy Library ***/
type Props = {
  /**
   * Target component that, when hovered, will trigger the tooltip to show up.
   * The target(children) of the tooltip are wrapped into a div.
   * This is a bypass to not have to forward the ref to the DOM node.
   */
  children: React.ReactNode;

  /**
   * Content shown inside of the tooltip.
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
   * Optional value that allows you to interact with the Tooltip. This is useful for when
   * you have a clickable component inside of your Tooltip.
   * When set to true, the Tooltip will no longer disappear when clicked
   */
  interactive?: boolean;

  /**
   * Optional that allows you to override the default max width of the tooltip
   * Possible values: number (px), string (with units "rem") or string 'none'.
   */
  maxWidth?: number | string;

  /**
   * Optional that allows you to override the default element that the children get put inside of.
   * Default value is a span.
   */
  tag?: 'span' | 'div';

  /**
   * Optional className that is added to the Wrapper component
   * Allowing you to add classes like margins and padding that would otherwise get lost
   * by the wrapping of the children inside of the CustomTag.
   */
  className?: string;

  /**
   * Optional CSS properties that are added to the Wrapper component
   * Allowing you to add CSS properties that would otherwise get lost
   * by the wrapping of the children inside of the CustomTag.
   */
  style?: CSSProperties;
};

/**
 * Bootstrap-like Tooltip component based on the Tippy.js library.
 */
export function Tooltip({
  children,
  placement = 'top',
  content,
  offset = 0,
  distance = 7,
  interactive,
  maxWidth = 350,
  tag = 'span',
  className,
  style
}: Props) {
  const Tag = tag;

  return (
    <Tippy
      className="border-0"
      content={content}
      placement={placement}
      offset={[ offset, distance ]}
      interactive={interactive}
      maxWidth={maxWidth}
    >
      <Tag className={className} style={{ outline: 0, ...style }} tabIndex={0} role="button">
        {children}
      </Tag>
    </Tippy>
  );
}
