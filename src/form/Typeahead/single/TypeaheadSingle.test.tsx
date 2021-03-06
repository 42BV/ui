import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import TypeaheadSingle from './TypeaheadSingle';

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

jest.mock('../../useOptions', () => {
  return { useOptions: jest.fn() };
});

jest.mock('./useAutoSelectOptionWhenQueryMatchesExactly');

describe('Component: TypeaheadSingle', () => {
  function setup({
    value,
    hasPlaceholder = true,
    hasLabel = true,
    loading = false,
    isOptionEnabled,
    isAsync = false,
    pageSize,
    text
  }: {
    value?: User;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
    loading?: boolean;
    isOptionEnabled?: IsOptionEnabled<User>;
    isAsync?: boolean;
    pageSize?: number;
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
        expect(size).toBe(!isAsync ? listOfUsers().length : pageSize ?? 10);
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
      text
    };

    const labelProps = hasLabel
      ? { id: 'bestFriend', label: 'Best friend' }
      : {};

    const typeaheadSingle = shallow(
      <TypeaheadSingle {...props} {...labelProps} />
    );

    return { typeaheadSingle, onBlurSpy, onChangeSpy };
  }

  describe('ui', () => {
    test('with value', () => {
      const { typeaheadSingle } = setup({ value: adminUser() });

      expect(toJson(typeaheadSingle)).toMatchSnapshot(
        'Component: TypeaheadSingle => ui => with value'
      );
    });

    test('async with a custom pageSize of 2 options in the dropdown', () => {
      const { typeaheadSingle } = setup({
        isAsync: true,
        pageSize: 2
      });

      expect(useOptions).toBeCalledTimes(1);
      expect(useOptions).toBeCalledWith(expect.objectContaining({ size: 2 }));

      expect(toJson(typeaheadSingle)).toMatchSnapshot(
        'Component: TypeaheadSingle => ui => async with a custom pageSize of 2 options in the dropdown'
      );
    });

    test('async with the default pageSize of 10 options in the dropdown', () => {
      const { typeaheadSingle } = setup({
        isAsync: true
      });

      expect(useOptions).toBeCalledTimes(1);
      expect(useOptions).toBeCalledWith(expect.objectContaining({ size: 10 }));

      expect(toJson(typeaheadSingle)).toMatchSnapshot(
        'Component: TypeaheadSingle => ui => async with the default pageSize of 10 options in the dropdown'
      );
    });

    test('without placeholder', () => {
      const { typeaheadSingle } = setup({
        value: adminUser(),
        hasPlaceholder: false
      });

      expect(toJson(typeaheadSingle)).toMatchSnapshot(
        'Component: TypeaheadSingle => ui => without placeholder'
      );
    });

    test('with the default pagination text', () => {
      const { typeaheadSingle } = setup({});

      expect(toJson(typeaheadSingle)).toMatchSnapshot(
        'Component: TypeaheadSingle => ui => with the default pagination text'
      );

      const reactstrapTypeahead = typeaheadSingle
        .find('div')
        .children()
        .first();
      expect(reactstrapTypeahead.props().paginationText).toBe(
        'Display additional results...'
      );
    });

    test('with a custom pagination text', () => {
      const { typeaheadSingle } = setup({
        text: {
          paginationText: 'Show more'
        }
      });

      expect(toJson(typeaheadSingle)).toMatchSnapshot(
        'Component: TypeaheadSingle => ui => with a custom pagination text'
      );

      const reactstrapTypeahead = typeaheadSingle
        .find('div')
        .children()
        .first();
      expect(reactstrapTypeahead.props().paginationText).toBe('Show more');
    });

    test('without label', () => {
      const { typeaheadSingle } = setup({
        value: adminUser(),
        hasLabel: false
      });

      expect(toJson(typeaheadSingle)).toMatchSnapshot(
        'Component: TypeaheadSingle => ui => without label'
      );
    });

    test('loading', () => {
      const { typeaheadSingle } = setup({
        isAsync: true,
        loading: true
      });

      const asyncTypeahead = typeaheadSingle.find('div').children().first();
      expect(asyncTypeahead.props().isLoading).toBe(true);
    });

    test('async delay', () => {
      const { typeaheadSingle } = setup({
        isAsync: true
      });

      const asyncTypeahead = typeaheadSingle.find('div').children().first();
      expect(asyncTypeahead.props().delay).toBe(200);
    });

    test('sync', () => {
      const { typeaheadSingle } = setup({
        isAsync: false
      });

      const asyncTypeahead = typeaheadSingle.find('div').children().first();
      expect(asyncTypeahead.props().delay).toBeUndefined();
      expect(asyncTypeahead.props().onSearch).toBeUndefined();
      expect(asyncTypeahead.props().isLoading).toBeUndefined();
    });
  });

  describe('events', () => {
    describe('onChange', () => {
      test('nothing selected', () => {
        const { typeaheadSingle, onChangeSpy } = setup({ value: undefined });

        const asyncTypeahead = typeaheadSingle.find('div').children().first();

        asyncTypeahead.props().onChange([]);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(undefined);
      });

      test('value selected', () => {
        const { typeaheadSingle, onChangeSpy, onBlurSpy } = setup({
          value: undefined
        });

        const asyncTypeahead = typeaheadSingle.find('div').children().first();

        const value = adminUser();

        asyncTypeahead.props().onChange([
          {
            label: 'Maarten',
            value
          }
        ]);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(value);

        expect(onBlurSpy).toHaveBeenCalledTimes(1);
      });
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

    it('should set the query when the user starts typing in the input field', () => {
      const { typeaheadSingle } = setup({
        value: undefined,
        isAsync: true
      });

      const asyncTypeahead = typeaheadSingle.find('div').children().first();

      asyncTypeahead.props().onSearch('admin');

      expect(useOptions).toBeCalledTimes(2);
      expect(useOptions).toBeCalledWith(
        expect.objectContaining({ query: 'admin' })
      );
    });

    it('should filter out disabled options from the typeahead options', () => {
      const { typeaheadSingle } = setup({
        value: adminUser(),
        isOptionEnabled: (user) => user.id !== userUser().id // Also disable the userUser
      });

      const asyncTypeahead = typeaheadSingle.find('div').children().first();

      const options = asyncTypeahead.props().options;

      expect(options).toEqual([
        { label: 'admin@42.nl', value: adminUser() },
        { label: 'coordinator@42.nl', value: coordinatorUser() }
      ]);
    });

    describe('value changes', () => {
      test('becomes empty', () => {
        const value = adminUser();

        const { typeaheadSingle } = setup({ value: adminUser() });

        let asyncTypeahead = typeaheadSingle.find('div').children().first();

        expect(asyncTypeahead.props().selected).toEqual([
          {
            label: 'admin@42.nl',
            value
          }
        ]);

        typeaheadSingle.setProps({ value: undefined });

        asyncTypeahead = typeaheadSingle.find('div').children().first();
        expect(asyncTypeahead.props().selected).toEqual([]);

        expect(typeaheadSingle.find('.showing-placeholder').length).toBe(1);
      });

      test('becomes filled', () => {
        const { typeaheadSingle } = setup({ value: undefined });

        let asyncTypeahead = typeaheadSingle.find('div').children().first();
        expect(asyncTypeahead.props().selected).toEqual([]);

        const value = adminUser();

        typeaheadSingle.setProps({
          value
        });

        asyncTypeahead = typeaheadSingle.find('div').children().first();
        expect(asyncTypeahead.props().selected).toEqual([
          {
            label: 'admin@42.nl',
            value
          }
        ]);

        expect(typeaheadSingle.find('.showing-placeholder').length).toBe(0);
      });
    });
  });
});
