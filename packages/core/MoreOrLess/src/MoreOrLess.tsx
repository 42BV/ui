import React, { useState } from 'react';
import take from 'lodash.take';
import classNames from 'classnames';

interface Props {
  /**
   * Amount of elements shown when closed (shown less).
   *
   * @type {number}
   * @memberof Props
   */
  limit: number;

  /**
   * Elements to show.
   *
   * @type {JSX.Element[]}
   * @memberof Props
   */
  content: JSX.Element[];

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   *
   * @type {string}
   * @memberof Props
   */
  className?: string;

  /**
   * Text to show when status is closed.
   * Allows you to pass an arbitrary number to show (e.g. `show 4 more`).
   *
   * @memberof Props
   */
  moreText?: (amount: number) => string;

  /**
   * Text to show when status is open.
   *
   * @type {string}
   * @memberof Props
   */
  lessText?: string;
}

/**
 * MoreOrLess is a component which truncates a collection of elements and shows a button to toggle this behavior.
 *
 * @export MoreOrLess
 * @param {Props} props
 * @returns {JSX.Element}
 */
export default function MoreOrLess({
  limit,
  content,
  className,
  moreText = (amount: number): string => `Show ${amount} more`,
  lessText = 'Show less'
}: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const text = isOpen ? lessText : moreText(content.length - limit);

  function toggleOpen() {
    setIsOpen(!isOpen);
  }

  return (
    <div
      className={classNames(className, 'more-or-less', {
        'more-or-less-opened': isOpen,
        'more-or-less-closed': !isOpen
      })}
    >
      {isOpen ? content : take(content, limit)}
      {content.length > limit && (
        <div role="button" className="more-or-less-link" onClick={toggleOpen}>
          {text}
        </div>
      )}
    </div>
  );
}
