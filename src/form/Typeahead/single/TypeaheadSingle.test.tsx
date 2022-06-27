import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TypeaheadSingle } from './TypeaheadSingle';

import { adminUser, coordinatorUser, listOfUsers, pageOfUsersFetcher, userUser } from '../../../test/fixtures';
import { User } from '../../../test/types';

import { pageOf } from '../../../utilities/page/page';
import { useOptions } from '../../useOptions';
import { IsOptionEnabled } from '../../option';
import { useAutoSelectOptionWhenQueryMatchesExactly } from './useAutoSelectOptionWhenQueryMatchesExactly';

jest.mock('../../useOptions', () => {
  return { useOptions: jest.fn() };
});

jest.mock('./useAutoSelectOptionWhenQueryMatchesExactly');

describe('Component: TypeaheadSingle', () => {
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
    text?: {
      paginationText?: string;
    };
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

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
      expect(screen.getByRole('combobox')).toHaveValue('admin@42.nl');
    });

    test('with placeholder', () => {
      setup({ hasPlaceholder: true });
      expect(screen.queryByPlaceholderText('Please provide your best friend')).toBeInTheDocument();
    });

    test('without placeholder', () => {
      setup({ hasPlaceholder: false });
      expect(screen.queryByPlaceholderText('Please provide your best friend')).not.toBeInTheDocument();
    });

    test('without id', () => {
      setup({ hasId: false, hasLabel: true });
      expect(screen.queryByLabelText('Best friend')).toBeInTheDocument();
    });

    test('visible label', () => {
      setup({ hasLabel: true });
      expect(screen.queryByText('Best friend')).toBeInTheDocument();
      expect(screen.queryByLabelText('Best friend')).toBeInTheDocument();
    });

    test('invisible label', () => {
      setup({ hasLabel: false });
      expect(screen.queryByText('Best friend')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Best friend')).toBeInTheDocument();
    });

    test('async with a custom pageSize of 2 options in the dropdown', async () => {
      expect.assertions(7);

      const { asFragment } = setup({
        isAsync: true,
        pageSize: 2
      });

      expect(useOptions).toBeCalledTimes(1);
      expect(useOptions).toBeCalledWith(expect.objectContaining({ size: 2 }));

      fireEvent.change(screen.getByRole('combobox'), { target: { value: '42.nl' } });

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

      expect(useOptions).toBeCalledTimes(1);
      expect(useOptions).toBeCalledWith(expect.objectContaining({ size: 10 }));

      fireEvent.change(screen.getByRole('combobox'), { target: { value: '42.nl' } });

      await waitFor(() => {
        expect(screen.queryAllByText('42.nl').length).toBe(3);
      });
      expect(asFragment()).toMatchSnapshot();
    });

    test('with the default pagination text', async () => {
      expect.assertions(5);

      const { asFragment } = setup({
        isAsync: true,
        maxResults: 2
      });

      fireEvent.change(screen.getByRole('combobox'), { target: { value: '42.nl' } });

      await waitFor(() => {
        expect(screen.queryByText('Display additional results...')).toBeInTheDocument();
      });
      expect(asFragment()).toMatchSnapshot();

    });

    test('with a custom pagination text', async () => {
      expect.assertions(9);

      const { asFragment } = setup({
        maxResults: 2,
        text: {
          paginationText: 'Show more'
        }
      });

      fireEvent.change(screen.getByRole('combobox'), { target: { value: '42.nl' } });

      await waitFor(() => {
        expect(screen.queryByText('Display additional results...')).not.toBeInTheDocument();
        expect(screen.queryByText('Show more')).toBeInTheDocument();
      });
      expect(asFragment()).toMatchSnapshot();
    });

    test('loading', () => {
      const { container } = setup({ isAsync: true, loading: true });
      expect(screen.queryByText('Loading...')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });

  });

  describe('events', () => {
    test('onChange', () => {
      const { onChangeSpy, onBlurSpy } = setup({
        value: undefined
      });

      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'admin' } });
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
      expect(useAutoSelectOptionWhenQueryMatchesExactly).toBeCalledTimes(1);
      expect(useAutoSelectOptionWhenQueryMatchesExactly).toBeCalledWith({
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
      expect.assertions(15);

      setup({
        value: undefined,
        isAsync: true
      });

      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'admin' } });

      await waitFor(() => {
        expect(useOptions).toBeCalledTimes(2);
        expect(useOptions).toHaveBeenLastCalledWith(
          expect.objectContaining({ query: 'admin' })
        );
      });
    });

    it('should filter out disabled options from the typeahead options', async () => {
      expect.assertions(6);

      setup({
        value: adminUser(),
        isOptionEnabled: (user) => user.id !== userUser().id // Also disable the userUser
      });

      fireEvent.focus(screen.getByRole('combobox'));

      await waitFor(() => {
        expect(screen.queryByLabelText('admin@42.nl')).toBeInTheDocument();
        expect(screen.queryByLabelText('coordinator@42.nl')).toBeInTheDocument();
        expect(screen.queryByLabelText('user@42.nl')).not.toBeInTheDocument();
      });
    });

    describe('value changes', () => {
      test('becomes empty', () => {
        const { props, rerender } = setup({ value: adminUser() });

        expect(screen.getByRole('combobox')).toHaveValue('admin@42.nl');

        const newProps = {
          ...props,
          value: undefined
        };

        rerender(
          <TypeaheadSingle {...newProps} />
        );

        expect(screen.getByRole('combobox')).toHaveValue('');
      });

      test('becomes filled', () => {
        const { props, rerender } = setup({});

        expect(screen.getByRole('combobox')).toHaveValue('');

        const newProps = {
          ...props,
          value: adminUser()
        };

        rerender(
          <TypeaheadSingle {...newProps} />
        );

        expect(screen.getByRole('combobox')).toHaveValue('admin@42.nl');
      });
    });
  });
});
