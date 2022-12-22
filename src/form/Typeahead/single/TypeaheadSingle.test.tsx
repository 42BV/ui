import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { TypeaheadSingle } from './TypeaheadSingle';

import {
  adminUser,
  coordinatorUser,
  listOfUsers,
  pageOfUsersFetcher,
  userUser
} from '../../../test/fixtures';
import { User } from '../../../test/types';

import { pageOf } from '../../../utilities/page/page';
import { useOptions } from '../../useOptions';
import { IsOptionEnabled } from '../../option';
import { useAutoSelectOptionWhenQueryMatchesExactly } from './useAutoSelectOptionWhenQueryMatchesExactly';

vi.mock('../../useOptions', () => {
  return { useOptions: vi.fn() };
});

vi.mock('./useAutoSelectOptionWhenQueryMatchesExactly');

describe.skip('Component: TypeaheadSingle', () => {
  function setup({
    value,
    hasPlaceholder,
    hasLabel,
    hasId = true,
    loading = false,
    isOptionEnabled,
    isAsync,
    pageSize,
    maxResults,
    allowNew,
    text
  }: {
    value?: User;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
    hasId?: boolean;
    loading?: boolean;
    isOptionEnabled?: IsOptionEnabled<User>;
    isAsync?: boolean;
    pageSize?: number;
    maxResults?: number;
    allowNew?: true;
    text?: {
      paginationText?: string;
    };
  }) {
    const onChangeSpy = vi.fn();
    const onBlurSpy = vi.fn();

    // @ts-expect-error This is in fact a mock
    useOptions.mockImplementation(
      ({ pageNumber, size, optionsShouldAlwaysContainValue }) => {
        expect(pageNumber).toBe(1);
        expect(size).toBe(!isAsync ? 3 : pageSize ?? 10);
        expect(optionsShouldAlwaysContainValue).toBe(false);

        return {
          page: pageOf(listOfUsers(), pageNumber, size),
          loading
        };
      }
    );

    const props = {
      placeholder: hasPlaceholder
        ? 'Please provide your best friend'
        : undefined,
      labelForOption: (user: User) => user.email,
      options: isAsync ? pageOfUsersFetcher : listOfUsers(),
      isOptionEnabled,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      pageSize,
      maxResults,
      allowNew,
      text,
      id: hasId ? 'bestFriend' : undefined,
      label: 'Best friend',
      hiddenLabel: !hasLabel
    };

    const { container, rerender, asFragment } = render(
      <TypeaheadSingle {...props} />
    );

    return { container, props, rerender, asFragment, onBlurSpy, onChangeSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with value', () => {
      setup({ value: adminUser() });
      // @ts-expect-error Form elements have property value
      expect(screen.getByRole('combobox').value).toEqual('admin@42.nl');
    });

    test('with placeholder', async () => {
      expect.assertions(3);
      setup({ hasPlaceholder: true });
      await screen.findByPlaceholderText('Please provide your best friend');
    });

    test('without placeholder', () => {
      setup({ hasPlaceholder: false });
      expect(
        screen.queryByPlaceholderText('Please provide your best friend')
      ).toBeNull();
    });

    test('without id', async () => {
      expect.assertions(3);
      setup({ hasId: false, hasLabel: true });
      await screen.findByLabelText('Best friend');
    });

    test('visible label', async () => {
      expect.assertions(3);
      setup({ hasLabel: true });
      await screen.findByText('Best friend');
      await screen.findByLabelText('Best friend');
    });

    test('invisible label', async () => {
      expect.assertions(4);
      setup({ hasLabel: false });
      expect(screen.queryByText('Best friend')).toBeNull();
      await screen.findByLabelText('Best friend');
    });

    test('async with a custom pageSize of 2 options in the dropdown', async () => {
      expect.assertions(7);

      const { asFragment } = setup({
        isAsync: true,
        pageSize: 2
      });

      expect(useOptions).toHaveBeenCalled();
      expect(useOptions).toHaveBeenLastCalledWith(
        expect.objectContaining({ size: 2 })
      );

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: '42.nl' }
      });

      await waitFor(() => {
        expect(screen.queryAllByText('42.nl').length).toBe(2);
      });
      expect(asFragment()).toMatchSnapshot();
    });

    test('async with the default pageSize of 10 options in the dropdown', async () => {
      expect.assertions(7);

      const { asFragment } = setup({
        isAsync: true
      });

      expect(useOptions).toHaveBeenCalled();
      expect(useOptions).toHaveBeenLastCalledWith(
        expect.objectContaining({ size: 10 })
      );

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: '42.nl' }
      });

      await waitFor(() => {
        expect(screen.queryAllByText('42.nl').length).toBe(3);
      });
      expect(asFragment()).toMatchSnapshot();
    });

    test('with the default pagination text', async () => {
      expect.assertions(4);

      const { asFragment } = setup({
        isAsync: true,
        maxResults: 2
      });

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: '42.nl' }
      });

      await screen.findByText('Display additional results...');
      expect(asFragment()).toMatchSnapshot();
    });

    test('with a custom pagination text', async () => {
      expect.assertions(8);

      const { asFragment } = setup({
        maxResults: 2,
        text: {
          paginationText: 'Show more'
        }
      });

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: '42.nl' }
      });

      await screen.findByText('Show more');
      expect(screen.queryByText('Display additional results...')).toBeNull();
      expect(asFragment()).toMatchSnapshot();
    });

    test('loading', async () => {
      expect.assertions(4);
      const { container } = setup({ isAsync: true, loading: true });
      await screen.findByText('Loading...');
      expect(container).toMatchSnapshot();
    });
  });

  describe('events', () => {
    test('onChange', () => {
      const { onChangeSpy, onBlurSpy } = setup({
        value: undefined
      });

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'admin' }
      });
      fireEvent.click(screen.getByLabelText('admin@42.nl'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(adminUser());

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('should call onChange with undefined when value is removed', () => {
      const { onChangeSpy, onBlurSpy } = setup({
        value: adminUser()
      });

      fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(undefined);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByLabelText('admin@42.nl'));
    });

    it('should automatically select an option when the query matches it exactly', () => {
      const { onChangeSpy } = setup({ value: undefined });

      // We simply test here if the hook is called correctly, the hook
      // itself is already tested.
      expect(useAutoSelectOptionWhenQueryMatchesExactly).toHaveBeenCalledTimes(
        17
      );
      expect(
        useAutoSelectOptionWhenQueryMatchesExactly
      ).toHaveBeenLastCalledWith({
        onChange: onChangeSpy,
        query: '',
        typeaheadOptions: [
          { label: 'admin@42.nl', value: adminUser() },
          { label: 'coordinator@42.nl', value: coordinatorUser() },
          { label: 'user@42.nl', value: userUser() }
        ]
      });
    });

    it('should set the query when the user starts typing in the input field', async () => {
      expect.assertions(22);

      setup({
        value: undefined,
        isAsync: true
      });

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'admin' }
      });

      await waitFor(() => {
        expect(useOptions).toHaveBeenCalled();
        expect(useOptions).toHaveBeenLastCalledWith(
          expect.objectContaining({ query: 'admin' })
        );
      });
    });

    it('should filter out disabled options from the typeahead options', async () => {
      expect.assertions(4);

      setup({
        value: adminUser(),
        isOptionEnabled: (user) => user.id !== userUser().id // Also disable the userUser
      });

      fireEvent.focus(screen.getByRole('combobox'));

      await screen.findByLabelText('admin@42.nl');
      await screen.findByLabelText('coordinator@42.nl');
      expect(screen.queryByLabelText('user@42.nl')).toBeNull();
    });

    it('should call onChange with custom typeahead option when allowNew is true and option does not exist', async () => {
      expect.assertions(8);

      const { onChangeSpy } = setup({
        allowNew: true
      });

      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'Test' }
      });

      await screen.queryByLabelText('Test');

      fireEvent.click(screen.getByLabelText('Test'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy.mock.calls[0][0]).toMatchObject({
        label: 'Test',
        customOption: true
      });
    });

    describe('value changes', () => {
      test('becomes empty', () => {
        const { props, rerender } = setup({ value: adminUser() });

        // @ts-expect-error Form elements have property value
        expect(screen.getByRole('combobox').value).toEqual('admin@42.nl');

        const newProps = {
          ...props,
          value: undefined
        };

        rerender(<TypeaheadSingle {...newProps} />);

        // @ts-expect-error Form elements have property value
        expect(screen.getByRole('combobox').value).toEqual('');
      });

      test('becomes filled', () => {
        const { props, rerender } = setup({});

        // @ts-expect-error Form elements have property value
        expect(screen.getByRole('combobox').value).toEqual('');

        const newProps = {
          ...props,
          value: adminUser()
        };

        rerender(<TypeaheadSingle {...newProps} />);

        // @ts-expect-error Form elements have property value
        expect(screen.getByRole('combobox').value).toEqual('admin@42.nl');
      });
    });
  });
});
