import React from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { TypeaheadMultiple } from './TypeaheadMultiple';

import {
  adminUser,
  listOfUsers,
  pageOfUsersFetcher,
  userUser
} from '../../../test/fixtures';
import { User } from '../../../test/types';

import { pageOf } from '../../../utilities/page/page';
import { useOptions } from '../../useOptions';
import { IsOptionEnabled } from '../../option';
import userEvent from '@testing-library/user-event';

vi.mock('../../useOptions', () => {
  return { useOptions: vi.fn() };
});

describe.skip('Component: TypeaheadMultiple', () => {
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
    value?: User[];
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
      options: isAsync ? pageOfUsersFetcher : listOfUsers(),
      labelForOption: (user: User) => user.email,
      isOptionEnabled,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      pageSize,
      maxResults,
      allowNew,
      text,
      error: 'Some error',
      id: hasId ? 'bestFriend' : undefined,
      label: 'Best friend',
      hiddenLabel: !hasLabel
    };

    const { container, rerender, asFragment } = render(
      <TypeaheadMultiple {...props} />
    );

    return { container, props, rerender, asFragment, onChangeSpy, onBlurSpy };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('with value', () => {
      setup({ value: [adminUser()] });
      expect(screen.queryAllByText('×').length).toBe(1);
      expect(screen.getByText('×').parentNode?.textContent).toBe(
        'admin@42.nl×'
      );
    });

    test('with placeholder', async () => {
      expect.assertions(0);
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
      expect.assertions(0);
      setup({ hasId: false, hasLabel: true });
      await screen.findByLabelText('Best friend');
    });

    test('visible label', async () => {
      expect.assertions(0);
      setup({ hasLabel: true });
      await screen.findByText('Best friend');
      await screen.findByLabelText('Best friend');
    });

    test('invisible label', async () => {
      expect.assertions(1);
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

      expect(useOptions).toBeCalledTimes(1);
      expect(useOptions).toBeCalledWith(expect.objectContaining({ size: 2 }));

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '42.nl' }
      });

      await waitFor(() => {
        expect(screen.queryAllByText('42.nl').length).toBe(2);
      });
      expect(asFragment()).toMatchSnapshot();
    });

    test('async with the default pageSize of 10 options in the dropdown', async () => {
      expect.assertions(7);

      const { asFragment } = setup({ isAsync: true });

      expect(useOptions).toBeCalledTimes(1);
      expect(useOptions).toBeCalledWith(expect.objectContaining({ size: 10 }));

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '42.nl' }
      });

      await waitFor(() => {
        expect(screen.queryAllByText('42.nl').length).toBe(3);
      });
      expect(asFragment()).toMatchSnapshot();
    });

    test('with the default pagination text', async () => {
      expect.assertions(1);

      const { asFragment } = setup({
        isAsync: true,
        maxResults: 2
      });

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '42.nl' }
      });

      await screen.findByText('Display additional results...');
      expect(asFragment()).toMatchSnapshot();
    });

    test('with a custom pagination text', async () => {
      expect.assertions(2);

      const { asFragment } = setup({
        isAsync: true,
        maxResults: 2,
        text: {
          paginationText: 'Show more'
        }
      });

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '42.nl' }
      });

      await screen.findByText('Show more');
      expect(screen.queryByText('Display additional results...')).toBeNull();
      expect(asFragment()).toMatchSnapshot();
    });

    test('loading', async () => {
      expect.assertions(1);
      const { container } = setup({ loading: true, isAsync: true });
      await screen.findByText('Loading...');
      expect(container).toMatchSnapshot();
    });
  });

  describe('renderToken', () => {
    it('should when the Tag is closed call onRemove', () => {
      const { onChangeSpy } = setup({
        value: [adminUser()]
      });

      fireEvent.click(screen.getByText('×'));

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith(undefined);
    });
  });

  describe('events', () => {
    test('onChange', async () => {
      expect.assertions(21);

      const { onBlurSpy, onChangeSpy } = setup({
        value: []
      });

      await userEvent.type(screen.getByRole('textbox'), 'admin');
      fireEvent.click(screen.getByLabelText('admin@42.nl'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith([adminUser()]);
      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('should set the query when the user starts typing in the input field', async () => {
      expect.assertions(14);
      setup({
        isAsync: true
      });

      expect(useOptions).toBeCalledTimes(1);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'admin' }
      });

      await waitFor(() => {
        expect(useOptions).toBeCalledTimes(2);
        expect(useOptions).toBeCalledWith(
          expect.objectContaining({ query: 'admin' })
        );
      });
    });

    it('should filter out already selected values and disabled options from the typeahead options', async () => {
      expect.assertions(2);

      setup({
        value: [adminUser()], // The admin user is select, so it should be filtered out
        isOptionEnabled: (user) => user.id !== userUser().id // Also disable the userUser
      });

      fireEvent.focus(screen.getByRole('textbox'));

      await screen.findByLabelText('coordinator@42.nl');
      expect(screen.queryByLabelText('admin@42.nl')).toBeNull();
      expect(screen.queryByLabelText('user@42.nl')).toBeNull();
    });

    it('should call onChange with custom typeahead option when allowNew is true and option does not exist', async () => {
      expect.assertions(2);

      const { onChangeSpy } = setup({
        allowNew: true
      });

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'Test' }
      });

      await screen.findByLabelText('Test');

      fireEvent.click(screen.getByLabelText('Test'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy.mock.calls[0][0]).toMatchObject([
        { label: 'Test', customOption: true }
      ]);
    });

    describe('value changes', () => {
      test('becomes empty', async () => {
        expect.assertions(1);

        const { props, rerender } = setup({
          value: [adminUser()]
        });

        await screen.findByText('admin@42.nl', { exact: false });

        const newProps = {
          ...props,
          value: undefined
        };

        rerender(<TypeaheadMultiple {...newProps} />);

        expect(screen.queryByText('admin@42.nl', { exact: false })).toBeNull();
      });

      test('becomes filled', async () => {
        expect.assertions(1);

        const { props, rerender } = setup({});

        expect(screen.queryByText('admin@42.nl', { exact: false })).toBeNull();

        const newProps = {
          ...props,
          value: [adminUser()]
        };

        rerender(<TypeaheadMultiple {...newProps} />);

        await screen.findByText('admin@42.nl', { exact: false });
      });
    });
  });
});
