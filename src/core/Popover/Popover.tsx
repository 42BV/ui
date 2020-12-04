import React, { CSSProperties } from 'react';
import * as Popper from 'popper.js';
import Tippy from '@tippyjs/react';

/*** Popover component based on the Tippy Library ***/
type Props = {
  /**
   * Optionally whether or not the popover is currently open,
   * when undefined, which is the default, the popover will show
   * when hovered over the target(children). When providing a boolean
   * you can takeover when the popover is shown from outside the
   * Popover component.
   */
  isOpen?: boolean;

  /**
   * Optionally callback that gets triggered when clicked outside the popover.
   * Is useful for when wanting to take complete control over the popover.
   */
  onClickOutside?: () => void;

  /**
   * Content shown inside of the popover.
   */
  children: React.ReactNode;

  /**
   * Target component that, when hovered, will trigger the popover to show up.
   * The target(children) of the popover are wrapped into a div.
   * This is a bypass to not have to forward the ref to the DOM node.
   */
  target: React.ReactNode;

  /**
   * Optional alignment relative to the target where the popover will be shown.
   */
  placement?: Popper.Placement;

  /**
   * Optional offset that the popover will show up relative from the target.
   */
  offset?: number;

  /**
   * Optional distance that the popover will show up relative from the target.
   */
  distance?: number;

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
 * Bootstrap-like Popover component based on the Tippy.js library.
 */
export default function Popover({
  children,
  placement = 'top',
  target,
  offset = 0,
  distance = 7,
  tag = 'span',
  className,
  isOpen,
  onClickOutside,
  style
}: Props) {
  const Tag = tag;

  return (
    <Tippy
      visible={isOpen}
      onClickOutside={onClickOutside}
      className="border-0 tippy-popover"
      content={<>{children}</>}
      placement={placement}
      offset={[offset, distance]}
      interactive={true}
      zIndex={1049} // One level below bootstrap's modal
    >
      <Tag className={className} style={style} tabIndex={0}>
        {target}
      </Tag>
    </Tippy>
  );
}
