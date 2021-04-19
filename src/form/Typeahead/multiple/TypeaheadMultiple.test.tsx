import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import TypeaheadMultiple from './TypeaheadMultiple';

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

jest.mock('../../useOptions', () => {
  return { useOptions: jest.fn() };
});

describe('Component: TypeaheadMultiple', () => {
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
    value?: User[];
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
      options: isAsync ? pageOfUsersFetcher : listOfUsers(),
      labelForOption: (user: User) => user.email,
      isOptionEnabled,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      pageSize,
      text,
      error: 'Some error'
    };

    const labelProps = hasLabel
      ? { id: 'bestFriend', label: 'Best friend' }
      : {};

    const typeaheadMultiple = shallow(
      <TypeaheadMultiple {...props} {...labelProps} />
    );

    return { typeaheadMultiple, onChangeSpy, onBlurSpy };
  }

  describe('ui', () => {
    test('with value', () => {
      const { typeaheadMultiple } = setup({ value: [adminUser()] });

      expect(toJson(typeaheadMultiple)).toMatchSnapshot(
        'Component: TypeaheadMultiple => ui => with value'
      );
    });

    test('without placeholder', () => {
      const { typeaheadMultiple } = setup({
        value: [adminUser()],
        hasPlaceholder: false
      });

      expect(toJson(typeaheadMultiple)).toMatchSnapshot(
        'Component: TypeaheadMultiple => ui => without placeholder'
      );
    });

    test('async with a custom pageSize of 2 options in the dropdown', () => {
      const { typeaheadMultiple } = setup({
        isAsync: true,
        pageSize: 2
      });

      expect(useOptions).toBeCalledTimes(1);
      expect(useOptions).toBeCalledWith(expect.objectContaining({ size: 2 }));

      expect(toJson(typeaheadMultiple)).toMatchSnapshot(
        'Component: TypeaheadMultiple => ui => async with a custom pageSize of 2 options in the dropdown'
      );
    });

    test('async with the default pageSize of 10 options in the dropdown', () => {
      const { typeaheadMultiple } = setup({
        isAsync: true
      });

      expect(useOptions).toBeCalledTimes(1);
      expect(useOptions).toBeCalledWith(expect.objectContaining({ size: 10 }));

      expect(toJson(typeaheadMultiple)).toMatchSnapshot(
        'Component: TypeaheadMultiple => ui => async with the default pageSize of 10 options in the dropdown'
      );
    });

    test('with the default pagination text', () => {
      const { typeaheadMultiple } = setup({});

      expect(toJson(typeaheadMultiple)).toMatchSnapshot(
        'Component: TypeaheadMultiple => ui => with the default pagination text'
      );

      const reactstrapTypeahead = typeaheadMultiple
        .find('div')
        .children()
        .first();
      expect(reactstrapTypeahead.props().paginationText).toBe(
        'Display additional results...'
      );
    });

    test('with a custom pagination text', () => {
      const { typeaheadMultiple } = setup({
        text: {
          paginationText: 'Show more'
        }
      });

      expect(toJson(typeaheadMultiple)).toMatchSnapshot(
        'Component: TypeaheadMultiple => ui => with a custom pagination text'
      );

      const reactstrapTypeahead = typeaheadMultiple
        .find('div')
        .children()
        .first();
      expect(reactstrapTypeahead.props().paginationText).toBe('Show more');
    });

    test('without label', () => {
      const { typeaheadMultiple } = setup({
        value: [adminUser()],
        hasLabel: false
      });

      expect(toJson(typeaheadMultiple)).toMatchSnapshot(
        'Component: TypeaheadMultiple => ui => without label'
      );
    });

    test('loading', () => {
      const { typeaheadMultiple } = setup({
        loading: true,
        isAsync: true
      });

      const asyncTypeahead = typeaheadMultiple.find('div').children().first();
      expect(asyncTypeahead.props().isLoading).toBe(true);
    });

    test('async delay', () => {
      const { typeaheadMultiple } = setup({
        isAsync: true
      });

      const asyncTypeahead = typeaheadMultiple.find('div').children().first();
      expect(asyncTypeahead.props().delay).toBe(200);
    });

    test('sync', () => {
      const { typeaheadMultiple } = setup({
        isAsync: false
      });

      const asyncTypeahead = typeaheadMultiple.find('div').children().first();
      expect(asyncTypeahead.props().delay).toBeUndefined();
      expect(asyncTypeahead.props().onSearch).toBeUndefined();
      expect(asyncTypeahead.props().isLoading).toBeUndefined();
    });
  });

  describe('renderToken', () => {
    function setupRenderToken() {
      const { typeaheadMultiple } = setup({
        value: [adminUser()],
        hasLabel: false
      });

      const renderToken = typeaheadMultiple
        .find('div')
        .children()
        .first()
        .renderProp('renderToken');

      const onRemoveSpy = jest.fn();
      const token = renderToken(
        { label: '42', value: 42 },
        { onRemove: onRemoveSpy },
        1337 // Give it a random index
      );

      return { token, onRemoveSpy };
    }

    test('ui', () => {
      const { token } = setupRenderToken();

      expect(toJson(token)).toMatchSnapshot(
        'Component: TypeaheadMultiple => renderToken => ui'
      );
    });

    it('should when the Tag is closed call onRemove', () => {
      const { token, onRemoveSpy } = setupRenderToken();

      token.props().onRemove();

      expect(onRemoveSpy).toBeCalledTimes(1);
      expect(onRemoveSpy).toBeCalledWith({ label: '42', value: 42 });
    });
  });

  describe('events', () => {
    describe('onChange', () => {
      test('nothing selected', () => {
        const { typeaheadMultiple, onBlurSpy, onChangeSpy } = setup({
          value: []
        });

        const asyncTypeahead = typeaheadMultiple.find('div').children().first();

        asyncTypeahead.props().onChange([]);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(undefined);
        expect(onBlurSpy).toHaveBeenCalledTimes(1);
      });

      test('value selected', () => {
        const { typeaheadMultiple, onBlurSpy, onChangeSpy } = setup({
          value: []
        });

        const asyncTypeahead = typeaheadMultiple.find('div').children().first();

        asyncTypeahead.props().onChange([
          {
            label: 'admin@42.nl',
            value: adminUser
          },
          {
            label: 'user@42.nl',
            value: userUser
          }
        ]);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith([adminUser, userUser]);
        expect(onBlurSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('should set the query when the user starts typing in the input field', () => {
      const { typeaheadMultiple } = setup({
        value: undefined,
        isAsync: true
      });

      const asyncTypeahead = typeaheadMultiple.find('div').children().first();

      asyncTypeahead.props().onSearch('admin');

      expect(useOptions).toBeCalledTimes(2);
      expect(useOptions).toBeCalledWith(
        expect.objectContaining({ query: 'admin' })
      );
    });

    it('should filter out already selected values and disabled options from the typeahead options', () => {
      const { typeaheadMultiple } = setup({
        value: [adminUser()], // The admin user is select so it should be filtered out
        isOptionEnabled: (user) => user.id !== userUser().id // Also disable the userUser
      });

      const asyncTypeahead = typeaheadMultiple.find('div').children().first();

      const options = asyncTypeahead.props().options;

      expect(options).toEqual([
        { label: 'coordinator@42.nl', value: coordinatorUser() }
      ]);
    });

    describe('value changes', () => {
      test('becomes empty', () => {
        const { typeaheadMultiple } = setup({ value: [adminUser()] });

        let asyncTypeahead = typeaheadMultiple.find('div').children().first();
        expect(asyncTypeahead.props().selected).toEqual([
          {
            label: 'admin@42.nl',
            value: adminUser()
          }
        ]);

        typeaheadMultiple.setProps({ value: undefined });

        asyncTypeahead = typeaheadMultiple.find('div').children().first();
        expect(asyncTypeahead.props().selected).toEqual([]);

        expect(typeaheadMultiple.find('.showing-placeholder').length).toBe(1);
      });

      test('becomes filled', () => {
        const { typeaheadMultiple } = setup({ value: undefined });

        let asyncTypeahead = typeaheadMultiple.find('div').children().first();
        expect(asyncTypeahead.props().selected).toEqual([]);

        const value = adminUser();

        typeaheadMultiple.setProps({
          value: [value]
        });

        asyncTypeahead = typeaheadMultiple.find('div').children().first();
        expect(asyncTypeahead.props().selected).toEqual([
          {
            label: 'admin@42.nl',
            value
          }
        ]);

        expect(typeaheadMultiple.find('.showing-placeholder').length).toBe(0);
      });
    });
  });
});
