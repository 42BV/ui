import React from 'react';
import classNames from 'classnames';
import { Color } from '../types';

type Props = {
  /**
   * Text to display within the tag.
   */
  text: string;

  /**
   * The color of the badge. Supports Bootstrap colors (e.g. primary, danger).
   * Defaults to `primary`.
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
};

/**
 * Tag is a component which shows a piece of text inside a colored
 * background. Under the hood the Tag component is a bootstrap badge
 * with the option to show a close button.
 *
 * An example of a good use case for using a `Tag` is for blog post
 * which belong in a category, each category could be a `Tag`. Another
 * example is someone's hobby's on a profile page, each hobby could
 * be a `Tag`.
 */
export function Tag({ text, color = 'primary', onRemove, className }: Props) {
  const canClose = onRemove !== undefined;
  const classes = classNames('badge rounded-pill', className, {
    [`text-bg-${color}`]: color
  });

  return (
    <span className={classes}>
      {text}

      {canClose ? (
        <span onClick={onRemove} className="close-button" role="button">
          ×
        </span>
      ) : null}
    </span>
  );
}
