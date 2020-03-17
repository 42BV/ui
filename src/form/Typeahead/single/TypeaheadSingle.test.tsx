import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import TypeaheadSingle from './TypeaheadSingle';

import {
  adminUser,
  coordinatorUser,
  pageOfUsers,
  userUser
} from '../../../test/fixtures';
import { User } from '../../../test/types';
import { resolvablePromise, waitForUI } from '../../../test/utils';

describe('Component: TypeaheadSingle', () => {
  function setup({
    value,
    hasPlaceholder = true,
    hasLabel = true
  }: {
    value?: User;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
  }) {
    const optionsSpy = jest.fn();
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    const props = {
      placeholder: hasPlaceholder
        ? 'Please provide your best friend'
        : undefined,
      optionForValue: (user: User) => user.email,
      options: optionsSpy,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error'
    };

    const labelProps = hasLabel
      ? { id: 'bestFriend', label: 'Best friend' }
      : {};

    const typeaheadSingle = shallow(
      <TypeaheadSingle {...props} {...labelProps} />
    );

    return { typeaheadSingle, optionsSpy, onBlurSpy, onChangeSpy };
  }

  describe('ui', () => {
    test('with value', () => {
      const { typeaheadSingle } = setup({ value: adminUser() });

      expect(toJson(typeaheadSingle)).toMatchSnapshot(
        'Component: TypeaheadSingle => ui => with value'
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

    test('without label', () => {
      const { typeaheadSingle } = setup({
        value: adminUser(),
        hasLabel: false
      });

      expect(toJson(typeaheadSingle)).toMatchSnapshot(
        'Component: TypeaheadSingle => ui => without label'
      );
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

    describe('options', () => {
      test('value does not match query', async () => {
        expect.assertions(6);

        const { typeaheadSingle, optionsSpy, onChangeSpy } = setup({
          value: undefined
        });

        const { resolve, promise } = resolvablePromise();

        optionsSpy.mockReturnValue(promise);

        let asyncTypeahead = typeaheadSingle.find('div').children().first();

        asyncTypeahead.props().onSearch('Ma');

        await waitForUI(() => {
          asyncTypeahead = typeaheadSingle.find('div').children().first();

          expect(asyncTypeahead.props().isLoading).toBe(true);
        });

        resolve(pageOfUsers());

        await waitForUI(() => {
          asyncTypeahead = typeaheadSingle.find('div').children().first();

          expect(asyncTypeahead.props().isLoading).toBe(false);
        });

        asyncTypeahead = typeaheadSingle.find('div').children().first();

        expect(asyncTypeahead.props().options).toEqual([
          {
            label: 'admin@42.nl',
            value: adminUser()
          },
          {
            label: 'coordinator@42.nl',
            value: coordinatorUser()
          },
          {
            label: 'user@42.nl',
            value: userUser()
          }
        ]);

        expect(asyncTypeahead.props().isLoading).toBe(false);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(undefined);
      });

      test('value matches query', async () => {
        expect.assertions(4);

        const { typeaheadSingle, optionsSpy, onChangeSpy } = setup({
          value: undefined
        });

        const promise = Promise.resolve(pageOfUsers());

        optionsSpy.mockReturnValue(promise);

        let asyncTypeahead = typeaheadSingle.find('div').children().first();

        asyncTypeahead.props().onSearch('admin@42.nl');

        await promise;

        asyncTypeahead = typeaheadSingle.find('div').children().first();

        expect(asyncTypeahead.props().options).toEqual([
          {
            label: 'admin@42.nl',
            value: adminUser()
          },
          {
            label: 'coordinator@42.nl',
            value: coordinatorUser()
          },
          {
            label: 'user@42.nl',
            value: userUser()
          }
        ]);

        expect(asyncTypeahead.props().isLoading).toBe(false);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(adminUser());
      });
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
