import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { CrudTable } from './CrudTable';
import { Page } from '@42.nl/spring-connect';
import { Tag } from '../../core/Tag/Tag';
import { Button } from '../../core/Button/Button';
import { pageOfUsers } from '../../test/fixtures';
import { EpicRow } from '../EpicTable/rows/EpicRow/EpicRow';
import { EpicCell } from '../EpicTable/cells/EpicCell/EpicCell';
import lodash from 'lodash';

describe('Component: CrudTable', () => {
  function setup({
    buttons,
    renderSelection,
    canSearch,
    searchValue,
    page
  }: {
    buttons?: () => React.ReactNode;
    renderSelection?: () => React.ReactNode;
    canSearch?: () => boolean;
    searchValue?: string;
    page?: Page<any>;
  }) {
    const onSearchSpy = vi.fn();
    const pageChangedSpy = vi.fn();

    const { container } = render(
      <CrudTable
        renderSelection={renderSelection}
        buttons={buttons}
        canSearch={canSearch}
        onSearch={onSearchSpy}
        searchValue={searchValue}
        page={page}
        pageChanged={pageChangedSpy}
      >
        <EpicRow>
          <EpicCell width={100} height={44}>
            test
          </EpicCell>
        </EpicRow>
      </CrudTable>
    );

    return { container, onSearchSpy, pageChangedSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with buttons', async () => {
      expect.assertions(0);
      setup({
        buttons: () => <Button onClick={vi.fn()}>click this button</Button>
      });
      await screen.findByText('click this button');
    });

    test('with selection', async () => {
      expect.assertions(0);
      setup({
        renderSelection: () => <Tag text="selected item" />
      });
      await screen.findByText('selected item');
    });

    test('without search', () => {
      setup({
        canSearch: () => false
      });
      expect(screen.queryByRole('searchbox')).toBeNull();
    });

    test('with search value', async () => {
      expect.assertions(1);
      setup({
        searchValue: 'test'
      });
      await screen.findByRole('searchbox');
      // @ts-expect-error Form elements have property value
      expect(screen.queryByRole('searchbox').value).toEqual('test');
    });

    test('with pagination', async () => {
      expect.assertions(0);
      setup({
        page: pageOfUsers()
      });
      await screen.findByText('arrow_forward');
    });
  });

  describe('events', () => {
    it('should call onSearch when the user types in the search field', () => {
      // @ts-expect-error Test mock
      vi.spyOn(lodash, 'debounce').mockImplementation((fn) => {
        return fn;
      });

      const { onSearchSpy } = setup({});

      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'test' }
      });

      expect(onSearchSpy).toBeCalledTimes(1);
      expect(onSearchSpy).toBeCalledWith('test');
    });

    it('should call pageChanged when the user clicks a page number', () => {
      const { pageChangedSpy } = setup({ page: pageOfUsers() });

      fireEvent.click(screen.getByText('arrow_forward'));

      expect(pageChangedSpy).toBeCalledTimes(1);
      expect(pageChangedSpy).toBeCalledWith(3);
    });
  });
});
