import React from 'react';
import { Page } from '@42.nl/spring-connect';

import {
  Pagination as RPagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';

import { Icon } from '../Icon';

type Props<T> = {
  /**
   * Represents Spring's page abstraction.
   */
  page: Page<T>;

  /**
   * Called when navigation to a certain page number.
   */
  onChange: (pageNumber: number) => void;

  /**
   * Whether or not to show the previous and next buttons.
   *
   * Defaults to `true`
   */
  showPreviousAndNextButtons?: boolean;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optionally customized text to use within the component.
   */
  text?: Text;
};

/**
 * The Pagination component is an enhanced Bootstrap pagination component. It supports working with `Page`s and shows a fixed
 * layout for the number of pages, indicating that multiple pages exist for the min and max ranges (e.g. 1 ... 4 5 6 ... 10).
 */
export default function Pagination<T>({
  page,
  onChange,
  className,
  showPreviousAndNextButtons = true
}: Props<T>) {
  const { first, last, totalPages } = page;

  // Don't bother to render if there is nothing to paginate.
  if (first && last) {
    return null;
  }

  const current = page.number;
  const content = pagesFor(current, totalPages);

  return (
    <RPagination className={className}>
      {showPreviousAndNextButtons ? (
        <PaginationItem disabled={first}>
          <PaginationLink onClick={() => onChange(current - 1)}>
            <Icon icon="arrow_back" size={14} />
          </PaginationLink>
        </PaginationItem>
      ) : null}
      {content.map((item, index) => (
        <PaginationItem active={item === current} key={index}>
          {item !== '...' ? (
            <PaginationLink onClick={() => onChange(item)}>
              {item}
            </PaginationLink>
          ) : (
            <PaginationLink className="disabled" disabled={true}>
              ...
            </PaginationLink>
          )}
        </PaginationItem>
      ))}
      {showPreviousAndNextButtons ? (
        <PaginationItem disabled={last}>
          <PaginationLink onClick={() => onChange(current + 1)}>
            <Icon icon="arrow_forward" size={14} />
          </PaginationLink>
        </PaginationItem>
      ) : null}
    </RPagination>
  );
}

type Dots = '...';

// Calculates which pages surround the current page.
export function pagesFor(
  currentPage: number,
  totalPages: number
): (number | Dots)[] {
  const content: (number | Dots)[] = [];

  if (currentPage > 1) {
    content.push(1);
  }

  const prev = currentPage - 1;
  if (prev > 1) {
    content.push(prev);
  }

  content.push(currentPage);

  const next = currentPage + 1;
  if (next <= totalPages) {
    content.push(next);
  }

  if (next + 1 <= totalPages) {
    content.push(totalPages);
  }

  if (content[0] === 1 && content[1] !== 2) {
    content.splice(1, 0, '...');
  }

  const lastIndex = content.length - 1;
  if (
    content[lastIndex] === totalPages &&
    content[lastIndex - 1] !== totalPages - 1
  ) {
    content.splice(lastIndex, 0, '...');
  }

  return content;
}
