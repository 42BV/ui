import React from 'react';
import Tippy from '@tippyjs/react';
import { ToolTipProps } from '../types';

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
}: ToolTipProps) {
  const Tag = tag;
  const outline = !!style?.outline ? style.outline : 0;

  return (
    <Tippy
      className="border-0"
      content={content}
      placement={placement}
      offset={[offset, distance]}
      interactive={interactive}
      maxWidth={maxWidth}
    >
      <Tag
        className={className}
        style={{ outline, ...style }}
        tabIndex={0}
        role="button"
      >
        {children}
      </Tag>
    </Tippy>
  );
}
