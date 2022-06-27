import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CrudHeader } from './CrudHeader';
import * as UseId from '../../../../hooks/useId/useId';
import userEvent from '@testing-library/user-event';

describe('Component: CrudHeader', () => {
  function setup({
    hasHeight,
    hasResize,
    hasSort,
    hasSearch,
    hasSearchOptions
  }: {
    hasHeight?: boolean;
    hasResize?: boolean;
    hasSort?: boolean;
    hasSearch?: boolean;
    hasSearchOptions?: boolean;
  }) {
    const onResizeSpy = jest.fn();
    const onSearchSpy = jest.fn();
    const onSortSpy = jest.fn();

    const props = {
      width: 300,
      height: hasHeight ? 100 : undefined,
      onResize: hasResize ? onResizeSpy : undefined,
      onSearch: hasSearch ? onSearchSpy : undefined,
      onSort: hasSort ? onSortSpy : undefined,
      options: hasSearchOptions ? [ 'crud', 'header' ] : undefined,
      labelForOption: hasSearchOptions ? (option) => option : undefined
    };

    const { container } = render(
      <CrudHeader {...props}>
        This is a header
      </CrudHeader>
    );

    return { container, onResizeSpy, onSearchSpy, onSortSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with height', () => {
      const { container } = setup({ hasHeight: true });
      expect(container.firstChild).toHaveStyle({ height: '100px' });
    });

    test('with resize', () => {
      setup({ hasResize: true });
      expect(screen.queryByTestId('epic-table-header-resize')).toBeInTheDocument();
    });

    test('with sort', () => {
      setup({ hasSort: true });
      expect(screen.queryByText('sort')).toBeInTheDocument();
    });

    test('with search', () => {
      setup({ hasSearch: true });
      expect(screen.queryByRole('searchbox')).toBeInTheDocument();
    });

    test('with search and height', () => {
      const { container } = setup({ hasSearch: true, hasHeight: true });
      expect(screen.queryByRole('searchbox')).toBeInTheDocument();
      expect(container.firstChild).toHaveStyle({ height: '100px' });
    });

    test('with search options', () => {
      jest.spyOn(UseId, 'useId').mockReturnValue('test');

      setup({ hasSearch: true, hasSearchOptions: true });

      expect(screen.queryByRole('combobox')).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: 'crud' })).toBeInTheDocument();
      expect(screen.queryByRole('option', { name: 'header' })).toBeInTheDocument();
    });
  });

  describe('events', () => {
    it('should call onSort when the user clicks the sorting button', () => {
      const { onSortSpy } = setup({ hasSort: true });

      fireEvent.click(screen.getByText('sort'));

      expect(onSortSpy).toBeCalledTimes(1);
      expect(onSortSpy).toBeCalledWith('ASC');
    });

    it('should call onSearch when the user types in the search field', () => {
      const { onSearchSpy } = setup({ hasSearch: true });

      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'test' } });

      expect(onSearchSpy).toBeCalledTimes(1);
      expect(onSearchSpy).toBeCalledWith('test');
    });

    it('should call onSearch when the user selects a search option', async () => {
      expect.assertions(2);

      const { onSearchSpy } = setup({ hasSearch: true, hasSearchOptions: true });

      await userEvent.selectOptions(screen.getByRole('combobox'), 'crud');

      expect(onSearchSpy).toBeCalledTimes(1);
      expect(onSearchSpy).toBeCalledWith('crud');
    });
  });
});
