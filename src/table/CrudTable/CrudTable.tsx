import React from 'react';
import { SearchInput } from '../../core/SearchInput/SearchInput';
import { EpicTable } from '../EpicTable/EpicTable';
import { Pagination } from '../../core/Pagination/Pagination';
import { Page } from '@42.nl/spring-connect';
import { t } from '../../utilities/translation/translation';

type Text = {
  searchLabel?: string;
};

type Props = {
  /**
   * Making it possible pass to on custom buttons.
   */
  buttons?: () => React.ReactNode;

  /**
   * Optional function which determines if the user can search the table.
   * When `true` a single `SearchInput` is rendered.
   * Defaults to a function which returns true.
   */
  canSearch?: () => boolean;

  /**
   * Provides a means of handling a search by the parent component itself.
   */
  onSearch?: (value: string) => void;

  /**
   * Optional search value.
   */
  searchValue?: string;

  /**
   * Optionally whether the label for the search input should be invisible.
   * Defaults to true.
   */
  hiddenSearchLabel?: boolean;

  /**
   * Optional callback function which you can use to render the current
   * selected items.
   */
  renderSelection?: () => React.ReactNode;

  /**
   * The page passed to the Pagination component to determine what page you
   * are on and how many page numbers should be displayed.
   */
  page?: Page<any>;

  /**
   * Optional callback that is triggered when one of the Pagination buttons
   * is clicked.
   */
  pageChanged?: (page: number) => void;

  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;

  /**
   * The content of the table.
   */
  children: React.ReactNode;
};

/**
 * CrudTable is an EpicTable wrapper to make it easier to display a table
 * with CRUD options. If page is defined, it also includes pagination.
 * It should be filled with `EpicRow`s, where the header row should be filled
 * with `CrudHeader`s.
 *
 * It supports working with a `Page` from `@42.nl/spring-connect`.
 */
export function CrudTable(props: Props) {
  const {
    buttons,
    canSearch = () => true,
    searchValue = '',
    onSearch,
    hiddenSearchLabel = true,
    renderSelection,
    page,
    pageChanged,
    text = {},
    children
  } = props;

  return (
    <>
      <div className="d-flex justify-content-end mb-2">
        {buttons ? buttons() : null}
      </div>

      {canSearch() && onSearch ? (
        <SearchInput
          label={t({
            key: 'CrudTable.SEARCH_LABEL',
            fallback: 'Start typing to search',
            overrideText: text.searchLabel
          })}
          hiddenLabel={hiddenSearchLabel}
          className="mb-4"
          defaultValue={searchValue}
          onChange={onSearch}
        />
      ) : null}

      {renderSelection ? renderSelection() : null}

      <EpicTable minHeight={400}>{children}</EpicTable>

      {page && pageChanged ? (
        <div className="d-flex justify-content-center">
          <Pagination className="my-3" page={page} onChange={pageChanged} />
        </div>
      ) : null}
    </>
  );
}
