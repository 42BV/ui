import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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
  } : {
    buttons?: () => React.ReactNode;
    renderSelection?: () => React.ReactNode;
    canSearch?: () => boolean;
    searchValue?: string;
    page?: Page<any>;
  }) {
    const onSearchSpy = jest.fn();
    const pageChangedSpy = jest.fn();

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
          <EpicCell width={100} height={44}>test</EpicCell>
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

    test('with buttons', () => {
      setup({
        buttons: () => <Button onClick={jest.fn()}>click this button</Button>
      });
      expect(screen.queryByText('click this button')).toBeInTheDocument();
    });

    test('with selection', () => {
      setup({
        renderSelection: () => <Tag text="selected item" />
      });
      expect(screen.queryByText('selected item')).toBeInTheDocument();
    });

    test('without search', () => {
      setup({
        canSearch: () => false
      });
      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    });

    test('with search value', () => {
      setup({
        searchValue: 'test'
      });
      expect(screen.queryByRole('searchbox')).toBeInTheDocument();
      expect(screen.queryByRole('searchbox')).toHaveValue('test');
    });

    test('with pagination', () => {
      setup({
        page: pageOfUsers()
      });
      expect(screen.queryByText('arrow_forward')).toBeInTheDocument();
    });
  });

  describe('events', () => {
    it('should call onSearch when the user types in the search field', () => {
      // @ts-expect-error Test mock
      jest.spyOn(lodash, 'debounce').mockImplementation((fn) => {
        return fn;
      });

      const { onSearchSpy } = setup({});

      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'test' } });

      expect(onSearchSpy).toBeCalledTimes(1);
      expect(onSearchSpy).toBeCalledWith('test');
    });

    it('should call pageChanged when the user clicks a page number', () => {
      const { pageChangedSpy } = setup({page: pageOfUsers()});

      fireEvent.click(screen.getByText('arrow_forward'));

      expect(pageChangedSpy).toBeCalledTimes(1);
      expect(pageChangedSpy).toBeCalledWith(3);
    });
  });
});
