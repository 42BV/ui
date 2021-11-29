import React from 'react';
import { Page } from '@42.nl/spring-connect';
import classNames from 'classnames';

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
   * Called when navigating to a certain page number.
   */
  onChange: (pageNumber: number) => void;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

/**
 * The Pagination component is an enhanced Bootstrap pagination component. It supports working with `Page`s and shows a fixed
 * layout for the number of pages, indicating that multiple pages exist for the min and max ranges (e.g. 1 ... 4 5 6 ... 10).
 */
export default function EpicPagination<T>({
  page,
  onChange,
  className
}: Props<T>) {
  const { first, last, totalPages } = page;

  // Don't bother to render if there is nothing to paginate.
  if (first && last) {
    return null;
  }

  const current = page.number;
  const content = pagesFor(current, totalPages);

  return (
    <RPagination className={classNames('epic-pagination', className)}>
      <PaginationItem disabled={first}>
        <PaginationLink onClick={() => onChange(1)}>
          <Icon className="center-icon" icon="first_page" />
        </PaginationLink>
      </PaginationItem>
      <PaginationItem disabled={first}>
        <PaginationLink onClick={() => onChange(current - 1)}>
          <Icon className="center-icon" icon="chevron_left" />
        </PaginationLink>
      </PaginationItem>
      {content.map((item, index) => (
        <PaginationItem active={item === current} key={index}>
          {item === '...' ? (
            <PaginationLink className="disabled" disabled={true} />
          ) : (
            <PaginationLink
              className={
                item >= 10000
                  ? 'scale-to-page-size-10000'
                  : item >= 1000
                    ? 'scale-to-page-size-1000'
                    : undefined
              }
              onClick={() => onChange(item)}
            >
              {item}
            </PaginationLink>
          )}
        </PaginationItem>
      ))}
      <PaginationItem disabled={last}>
        <PaginationLink onClick={() => onChange(current + 1)}>
          <Icon className="center-icon" icon="chevron_right" />
        </PaginationLink>
      </PaginationItem>
      <PaginationItem disabled={last}>
        <PaginationLink onClick={() => onChange(totalPages)}>
          <Icon className="center-icon" icon="last_page" />
        </PaginationLink>
      </PaginationItem>
      <PaginationItem disabled={true}>
        <div className="total-elements">{page.totalElements} records found</div>
      </PaginationItem>
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

  const prev2 = currentPage - 2;
  if (prev2 > 0) {
    content.push(prev2);
  } else {
    content.push('...');
  }

  const prev = currentPage - 1;
  if (prev > 0) {
    content.push(prev);
  } else {
    content.push('...');
  }

  content.push(currentPage);

  const next = currentPage + 1;
  if (next <= totalPages) {
    content.push(next);
  } else {
    content.push('...');
  }

  const next2 = currentPage + 2;
  if (next2 <= totalPages) {
    content.push(next2);
  } else {
    content.push('...');
  }

  return content;
}
