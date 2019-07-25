import React from 'react';
import classNames from 'classnames';
import { Color } from '@42.nl/ui-types';

type Type = 'info' | 'success' | 'warning' | 'danger';

interface Props {
  /**
   * Text to display within the tag.
   */
  text: string;

  /**
   * The color of the badge. Supports Bootstrap colors (e.g. primary, danger).
   */
  color?: Color;

  /**
   * Determines if a tag should be removable.
   */
  onRemove?: () => void;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
}

export default function Tag({ text, color, onRemove, className }: Props) {
  const canClose = onRemove !== undefined;
  const classes = classNames('token', className, {
    'token-removeable': canClose,
    [`token-${color}`]: color
  });

  return (
    <span className="tag">
      <span className={classes}>
        {text}

        {canClose ? (
          <span onClick={onRemove} className="close-button" role="button">
            ×
          </span>
        ) : null}
      </span>
    </span>
  );
}
