import React from 'react';
import { Page } from 'mad-spring-connect';

import {
  Pagination as RPagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';

interface Props<T> {
  /**
   * Represents Spring's page abstraction.
   *  @see {@link http://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/domain/Page.html}
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
}

export default function Pagination<T>({ page, onChange, className }: Props<T>) {
  const { first, last, totalPages } = page;

  // Don't bother to render if there is nothing to paginate.
  if (first && last) {
    return null;
  }

  const current = page.number;
  const content = pagesFor(current, totalPages);

  return (
    <RPagination className={className}>
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
    </RPagination>
  );
}

type Dots = '...';

// Calculates which pages surround the current page.
export function pagesFor(
  currentPage: number,
  totalPages: number
): (number | Dots)[] {
  const content = [];

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
    // @ts-ignore
    content.splice(1, 0, '...');
  }

  const lastIndex = content.length - 1;
  if (
    content[lastIndex] === totalPages &&
    content[lastIndex - 1] !== totalPages - 1
  ) {
    // @ts-ignore
    content.splice(lastIndex, 0, '...');
  }

  return content;
}