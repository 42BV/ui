import React, { CSSProperties, useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import { TippyPlacement } from '../types';

type Props = {
  /**
   * Optionally whether the popover is currently open,
   * when undefined, which is the default, the popover will show
   * when hovered over the target(children). When providing a boolean
   * you can take over when the popover is shown from outside the
   * Popover component.
   */
  isOpen?: boolean;

  /**
   * Optionally whether the popover should open on click instead of hover.
   */
  openOnClick?: boolean;

  /**
   * Optional callback that gets triggered when the tag is clicked.
   * When openOnClick is true, this component will take care of its visibility
   * state, unless onClick is defined.
   * This should be used when wanting to take complete control over the popover.
   */
  onClick?: () => void;

  /**
   * Optionally callback that gets triggered when clicked outside the popover.
   * Is useful for when wanting to take complete control over the popover.
   */
  onClickOutside?: () => void;

  /**
   * Content shown inside the popover.
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
  placement?: TippyPlacement;

  /**
   * Optional offset that the popover will show up relative from the target.
   */
  offset?: number;

  /**
   * Optional distance that the popover will show up relative from the target.
   */
  distance?: number;

  /**
   * Optionally the tag wrapping the children.
   * Default value is a span.
   */
  tag?: 'span' | 'div' | 'button';

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

  /**
   * Optionally set the maximum width of the popover.
   */
  maxWidth?: number;
};

/**
 * Bootstrap-like Popover component based on the Tippy.js library.
 */
export function Popover({
  children,
  placement = 'top',
  target,
  offset = 0,
  distance = 7,
  tag = 'span',
  className,
  isOpen,
  openOnClick,
  onClick,
  onClickOutside,
  style,
  maxWidth
}: Props) {
  const Tag = tag;

  const [visible, setVisible] = useState(openOnClick ? !!isOpen : undefined);

  useEffect(() => {
    setVisible(openOnClick ? !!isOpen : undefined);
  }, [openOnClick, isOpen]);

  function tagClicked() {
    if (onClick) {
      onClick();
    } else if (openOnClick) {
      setVisible(!visible);
    }
  }

  return (
    <Tippy
      visible={visible}
      onClickOutside={onClickOutside}
      className="border-0 tippy-popover"
      content={children}
      placement={placement}
      offset={[offset, distance]}
      interactive={true}
      zIndex={1049} // One level below bootstrap's modal
      maxWidth={maxWidth}
    >
      <Tag
        className={className}
        style={style}
        tabIndex={0}
        role="button"
        onClick={tagClicked}
      >
        {target}
      </Tag>
    </Tippy>
  );
}
