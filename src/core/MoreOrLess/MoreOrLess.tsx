import React, { useState } from 'react';
import { take } from 'lodash';
import classNames from 'classnames';
import { t } from '../../utilities/translation/translation';

type Text = {
  /**
   * Text to show when status is open.
   */
  less?: string;

  /**
   * Text to show when status is closed.
   * Allows you to pass an arbitrary number to show (e.g. `show 4 more`).
   */
  more?: (amount: number) => string;
};

type Props = {
  /**
   * Amount of elements shown when closed (shown less).
   */
  limit: number;

  /**
   * Elements to show.
   */
  content: React.ReactNode[];

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;
};

/**
 * MoreOrLess is a component which truncates a collection of elements and shows a button to toggle this behavior.
 */
export function MoreOrLess({
  limit,
  content,
  className,
  text = {}
}: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { more, less } = text;
  const amount = content.length - limit;

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
          {isOpen
            ? t({
                key: 'MoreOrLess.LESS',
                fallback: 'Show less',
                overrideText: less
              })
            : t({
                key: 'MoreOrLess.MORE',
                fallback: `Show ${amount} more`,
                data: { amount },
                overrideText: more ? more(amount) : undefined
              })}
        </div>
      )}
    </div>
  );
}
