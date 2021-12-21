import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { CrudTable } from './CrudTable';
import { Page } from '@42.nl/spring-connect';
import Tag from '../../core/Tag/Tag';
import SearchInput from '../../core/SearchInput/SearchInput';
import Button from '../../core/Button/Button';
import { pageOfUsers } from '../../test/fixtures';
import Pagination from '../../core/Pagination/Pagination';

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

    const crudTable = shallow(
      <CrudTable
        renderSelection={renderSelection}
        buttons={buttons}
        canSearch={canSearch}
        onSearch={onSearchSpy}
        searchValue={searchValue}
        page={page}
        pageChanged={pageChangedSpy}
      >
        crud table content
      </CrudTable>
    );

    return { crudTable, onSearchSpy, pageChangedSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { crudTable } = setup({});

      expect(toJson(crudTable)).toMatchSnapshot();
    });

    test('with buttons', () => {
      const { crudTable } = setup({
        buttons: () => <Button onClick={jest.fn()}>test</Button>
      });

      expect(toJson(crudTable)).toMatchSnapshot();
    });

    test('with selection', () => {
      const { crudTable } = setup({
        renderSelection: () => <Tag text="selected item" />
      });

      expect(toJson(crudTable)).toMatchSnapshot();
    });

    test('without search', () => {
      const { crudTable } = setup({
        canSearch: () => false
      });

      expect(toJson(crudTable)).toMatchSnapshot();
    });

    test('with search value', () => {
      const { crudTable } = setup({
        searchValue: 'test'
      });

      expect(toJson(crudTable)).toMatchSnapshot();
    });

    test('with pagination', () => {
      const { crudTable } = setup({
        page: pageOfUsers()
      });

      expect(toJson(crudTable)).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should call onSearch when the user types in the search field', () => {
      const { crudTable, onSearchSpy } = setup({});

      crudTable
        .find(SearchInput)
        .props()
        .onChange('test');

      expect(onSearchSpy).toBeCalledTimes(1);
      expect(onSearchSpy).toBeCalledWith('test');
    });

    it('should call pageChanged when the user clicks a page number', () => {
      const { crudTable, pageChangedSpy } = setup({page: pageOfUsers()});

      // @ts-expect-error Mock test
      crudTable
        .find(Pagination)
        .props()
        .onChange(2);

      expect(pageChangedSpy).toBeCalledTimes(1);
      expect(pageChangedSpy).toBeCalledWith(2);
    });
  });
});
