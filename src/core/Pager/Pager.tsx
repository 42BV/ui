import React from 'react';
import { Page } from '@42.nl/spring-connect';
import classNames from 'classnames';

import { t } from '../../utilities/translation/translation';
import Button from '../Button/Button';

interface Text {
  /**
   * The text to show as the next button's text, defaults to "Next"
   *
   * @default Cancel
   */
  next?: string;

  /**
   * The text to show as the previous button's text, defaults to "Previous"
   *
   * @default OK
   */
  previous?: string;
}

interface Props<T> {
  /**
   * Represents Spring's page abstraction.
   */
  page: Page<T>;

  /**
   * Called when navigation to a certain page number.
   */
  onChange: (pageNumber: number) => void;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optionally customized text to use within the component.
   */
  text?: Text;
}

/**
 * The Pager component shows a small variant of bootstraps pagination,
 * it only shows a previous and next button.
 *
 * It supports working with a `Page` from `@42.nl/spring-connect`.
 */
export default function Pager<T>({
  page,
  onChange,
  className,
  text = {}
}: Props<T>) {
  const { first, last } = page;
  const { next, previous } = text;

  // Don't bother to render if there is nothing to paginate.
  if (first && last) {
    return null;
  }

  return (
    <div className={classNames('pager', className)}>
      <Button
        className="mr-1"
        outline
        icon="arrow_back"
        disabled={first}
        onClick={() => onChange(page.number - 1)}
      >
        {t({
          overrideText: previous,
          key: 'Pager.PREVIOUS',
          fallback: 'Previous'
        })}
      </Button>

      <Button
        outline
        className="pager-next"
        icon="arrow_forward"
        iconPosition="right"
        disabled={last}
        onClick={() => onChange(page.number + 1)}
      >
        {t({
          overrideText: next,
          key: 'Pager.NEXT',
          fallback: 'Next'
        })}
      </Button>
    </div>
  );
}
