import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CrudHeader } from './CrudHeader';

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
    const onResizeSpy = vi.fn();
    const onSearchSpy = vi.fn();
    const onSortSpy = vi.fn();

    const props = {
      width: 300,
      height: hasHeight ? 100 : undefined,
      onResize: hasResize ? onResizeSpy : undefined,
      onSearch: hasSearch ? onSearchSpy : undefined,
      onSort: hasSort ? onSortSpy : undefined,
      options: hasSearchOptions ? ['crud', 'header'] : undefined,
      labelForOption: hasSearchOptions ? (option) => option : undefined
    };

    const { container } = render(
      <CrudHeader {...props}>This is a header</CrudHeader>
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
      // @ts-expect-error Child node is an Element
      expect(getComputedStyle(container.firstChild).height).toBe('100px');
    });

    test('with resize', async () => {
      expect.assertions(0);
      setup({ hasResize: true });
      await screen.findByTestId('epic-table-header-resize');
    });

    test('with sort', async () => {
      expect.assertions(0);
      setup({ hasSort: true });
      await screen.findByText('sort');
    });

    test('with search', async () => {
      expect.assertions(0);
      setup({ hasSearch: true });
      await screen.findByRole('searchbox');
    });

    test('with search and height', async () => {
      expect.assertions(1);
      const { container } = setup({ hasSearch: true, hasHeight: true });
      await screen.findByRole('searchbox');
      // @ts-expect-error Child node is an Element
      expect(getComputedStyle(container.firstChild).height).toBe('100px');
    });

    test('with search options', async () => {
      expect.assertions(0);

      setup({ hasSearch: true, hasSearchOptions: true });

      await screen.findByRole('combobox');
      await screen.findByRole('option', { name: 'crud' });
      await screen.findByRole('option', { name: 'header' });
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

      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'test' }
      });

      expect(onSearchSpy).toBeCalledTimes(1);
      expect(onSearchSpy).toBeCalledWith('test');
    });

    it('should call onSearch when the user selects a search option', async () => {
      expect.assertions(2);

      const { onSearchSpy } = setup({
        hasSearch: true,
        hasSearchOptions: true
      });

      await userEvent.selectOptions(screen.getByRole('combobox'), 'crud');

      expect(onSearchSpy).toBeCalledTimes(1);
      expect(onSearchSpy).toBeCalledWith('crud');
    });
  });
});
