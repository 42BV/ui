import React from 'react';
import classNames from 'classnames';

import {
  Pagination as RPagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';

import { Icon } from '../Icon';
import { PaginationProps } from '../types';

/**
 * The Pagination component is an enhanced Bootstrap pagination component. It supports working with `Page`s and shows a fixed
 * layout for the number of pages, indicating that multiple pages exist for the min and max ranges (e.g. 1 ... 4 5 6 ... 10).
 */
export function EpicPagination<TContent>({
  page,
  onChange,
  className
}: PaginationProps<TContent>) {
  const { first, last, totalPages } = page;

  // Don't bother to render if there is nothing to paginate.
  if (first && last) return null;

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
              className={determinePaginationLinkClass(item)}
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

/**
 * Composes a classname for a PaginationLink-component, based on the number of
 * items. Written to replace a nested ternary, providing a little more clarity.
 * @param numberOfItems
 */
function determinePaginationLinkClass(
  numberOfItems: number
): string | undefined {
  const className = 'scale-to-page-size-';
  if (numberOfItems > 10_000) return `${className}10000`;
  else if (numberOfItems > 1_000) return `${className}1000`;
  return undefined;
}

// Calculates which pages surround the current page.
export function pagesFor(
  currentPage: number,
  totalPages: number
): (number | '...')[] {
  const prev2 = currentPage > 2 ? currentPage - 2 : '...';
  const prev = currentPage > 1 ? currentPage - 1 : '...';
  const next = currentPage < totalPages ? currentPage + 1 : '...';
  const next2 = currentPage < totalPages - 1 ? currentPage + 2 : '...';

  return [prev2, prev, currentPage, next, next2];
}
