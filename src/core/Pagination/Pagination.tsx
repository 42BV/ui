import React from 'react';
import { Page } from '@42.nl/spring-connect';

import {
  Pagination as RPagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';

import { Icon } from '../Icon';
import { range } from 'lodash';
import { Select } from '../../form/Select/Select';
import { t } from '../../utilities/translation/translation';
import classNames from 'classnames';

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
 * a fixed layout for the number of pages, indicating that multiple pages
 * exist for the min and max ranges (e.g. 1 ... 4 5 6 ... 10).
 */
export function Pagination<T>({
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
  const content = pagesFor(current, totalPages);

  // Don't bother to render if there is nothing to paginate.
  if (
    first &&
    last &&
    (!onPageSizeChange ||
      (allowedPageSizes && allowedPageSizes[0] >= totalElements))
  ) {
    return null;
  }

  return (
    <div
      className={classNames(
        'd-flex justify-content-center flex-wrap flex-sm-nowrap',
        className
      )}
    >
      <RPagination>
        {showPreviousAndNextButtons ? (
          <PaginationItem disabled={first}>
            <PaginationLink onClick={() => onChange(current - 1)}>
              <Icon icon="arrow_back" size={14} />
            </PaginationLink>
          </PaginationItem>
        ) : null}
        {content.map((item, index) => (
          <PaginationItem active={item === current} key={index}>
            {item === '...' ? (
              <PaginationLink
                className="disabled"
                disabled={true}
                type="button"
              >
                {item}
              </PaginationLink>
            ) : (
              <PaginationLink onClick={() => onChange(item)} type="button">
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        {showPreviousAndNextButtons ? (
          <PaginationItem disabled={last}>
            <PaginationLink onClick={() => onChange(current + 1)} type="button">
              <Icon icon="arrow_forward" size={14} />
            </PaginationLink>
          </PaginationItem>
        ) : null}
      </RPagination>
      {showTotalElements ? (
        <div className="ms-3 mt-2 mt-sm-0 pagination__total-elements">
          {t({
            key: 'Pagination.TOTAL_ELEMENTS',
            data: { totalElements },
            fallback: `${totalElements} records found`,
            overrideText: text.totalElements
          })}
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

type Ellipsis = '...';

// Calculates which pages surround the current page.
export function pagesFor(
  currentPage: number,
  totalPages: number
): (number | Ellipsis)[] {
  const ellipsis: Ellipsis = '...';

  if (totalPages < 8) {
    return range(1, totalPages + 1);
  }

  if (currentPage < 5) {
    // {1} 2 3 ... 29 30 31
    // till
    // 1 2 3 {4} 5 ... 31

    const tillEllipsis = range(1, Math.max(4, currentPage + 2));
    const fromEllipsis = range(
      totalPages - (5 - tillEllipsis.length),
      totalPages + 1
    );

    return [...tillEllipsis, ellipsis, ...fromEllipsis];
  }

  if (currentPage > totalPages - 4) {
    // 1 ... 27 {28} 29 30 31
    // till
    // 1 2 3 ... 29 30 {31}

    const fromEllipsis = range(
      Math.min(totalPages - 2, currentPage - 1),
      totalPages + 1
    );
    const tillEllipsis = range(1, 7 - fromEllipsis.length);

    return [...tillEllipsis, ellipsis, ...fromEllipsis];
  }

  return [
    1,
    ellipsis,
    ...range(currentPage - 1, currentPage + 2),
    ellipsis,
    totalPages
  ];
}
