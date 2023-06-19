import React from 'react';
import { Page } from '@42.nl/spring-connect';
import classNames from 'classnames';

import {
  Pagination as RPagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';

import { Icon } from '../Icon';
import { Select } from '../../form/Select/Select';
import { t } from '../../utilities/translation/translation';

type Text = {
  pageSizeDropdownLabel?: string;
  totalElements?: string;
};

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
   * Optional callback to change the page's size using a dropdown.
   * Only if this property is provided, the dropdown will be displayed.
   */
  onPageSizeChange?: (size: number) => void;

  /**
   * Optional list of page sizes used for the page size dropdown.
   * Defaults to `[5, 10, 20, 50, 100]`.
   */
  allowedPageSizes?: number[];

  /**
   * Whether to show the previous and next buttons.
   *
   * Defaults to `true`
   */
  showPreviousAndNextButtons?: boolean;

  /**
   * Whether to show the total number of elements.
   *
   * Defaults to `true`
   */
  showTotalElements?: boolean;

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
 * The Pagination component is an enhanced Bootstrap pagination component.
 * It supports working with a `Page` from `@42.nl/spring-connect` and shows
 * a number of pages next to the current page number, always keeping the
 * current page number in the center.
 */
export function EpicPagination<T>({
  page,
  onChange,
  onPageSizeChange,
  allowedPageSizes = [5, 10, 20, 50, 100],
  className,
  showPreviousAndNextButtons = true,
  showTotalElements = true,
  text = {}
}: Props<T>) {
  const {
    first,
    last,
    totalPages,
    totalElements,
    size,
    number: current
  } = page;

  // Don't bother to render if there is nothing to paginate.
  if (
    first &&
    last &&
    (!onPageSizeChange ||
      (allowedPageSizes && allowedPageSizes[0] >= totalElements))
  ) {
    return null;
  }

  const content = pagesFor(current, totalPages);

  return (
    <div
      className={classNames(
        'epic-pagination d-flex justify-content-center flex-wrap flex-sm-nowrap',
        className
      )}
    >
      <RPagination>
        {showPreviousAndNextButtons ? (
          <>
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
          </>
        ) : null}
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
        {showPreviousAndNextButtons ? (
          <>
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
          </>
        ) : null}
      </RPagination>
      {showTotalElements ? (
        <div className="ms-3 pagination__total-elements">
          <span>
            {t({
              key: 'Pagination.TOTAL_ELEMENTS',
              data: { totalElements },
              fallback: `${totalElements} records found`,
              overrideText: text.totalElements
            })}
          </span>
        </div>
      ) : null}
      {onPageSizeChange && allowedPageSizes ? (
        <Select<number>
          onChange={onPageSizeChange}
          options={allowedPageSizes}
          labelForOption={(pageSize) =>
            t({
              key: 'Pagination.PAGE_SIZE',
              data: { pageSize },
              fallback: `${pageSize} items per page`
            })
          }
          value={size}
          className="ms-3 mt-2 mt-sm-0 pagination__select-size"
          label={t({
            key: 'Pagination.PAGE_SIZE_DROPDOWN_LABEL',
            fallback: 'Select page size',
            overrideText: text.pageSizeDropdownLabel
          })}
          hiddenLabel={true}
        />
      ) : null}
    </div>
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
