import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import TypeaheadMultiple from './TypeaheadMultiple';

import {
  adminUser,
  coordinatorUser,
  pageOfUsers,
  userUser
} from '../../../test/fixtures';
import { User } from '../../../test/types';

describe('Component: TypeaheadMultiple', () => {
  let typeaheadMultiple: ShallowWrapper;

  let fetchOptionsSpy: jest.Mock<any, any>;
  let onChangeSpy: jest.Mock<any, any>;
  let onBlurSpy: jest.Mock<any, any>;

  function setup({
    value,
    hasPlaceholder = true
  }: {
    value?: User[];
    hasPlaceholder?: boolean;
  }) {
    fetchOptionsSpy = jest.fn();
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();

    typeaheadMultiple = shallow(
      <TypeaheadMultiple
        id="bestFriend"
        label="Best friend"
        placeholder={
          hasPlaceholder ? 'Please provide your best friend' : undefined
        }
        optionForValue={(user: User) => user.email}
        fetchOptions={fetchOptionsSpy}
        value={value}
        onChange={onChangeSpy}
        onBlur={onBlurSpy}
        error="Some error"
      />
    );
  }

  describe('ui', () => {
    test('with value', () => {
      setup({ value: [adminUser] });

      expect(toJson(typeaheadMultiple)).toMatchSnapshot(
        'Component: TypeaheadMultiple => ui => with value'
      );
    });

    test('without placeholder', () => {
      setup({ value: [adminUser], hasPlaceholder: false });

      expect(toJson(typeaheadMultiple)).toMatchSnapshot(
        'Component: TypeaheadMultiple => ui => without placeholder'
      );
    });
  });

  describe('events', () => {
    describe('onChange', () => {
      test('nothing selected', () => {
        setup({ value: [] });

        const asyncTypeahead = typeaheadMultiple
          .find('div')
          .children()
          .first();

        asyncTypeahead.props().onChange([]);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(undefined);
        expect(onBlurSpy).toHaveBeenCalledTimes(1);
      });

      test('value selected', () => {
        setup({ value: [] });

        const asyncTypeahead = typeaheadMultiple
          .find('div')
          .children()
          .first();

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

    test('fetchOptions', async done => {
      setup({ value: undefined });

      const promise = Promise.resolve(pageOfUsers);

      fetchOptionsSpy.mockReturnValue(promise);

      const asyncTypeahead = typeaheadMultiple
        .find('div')
        .children()
        .first();

      asyncTypeahead.props().onSearch('Ma');

      try {
        await promise;
        expect(typeaheadMultiple.state()).toEqual({
          isLoading: false,
          options: [
            {
              label: 'admin@42.nl',
              value: adminUser
            },
            {
              label: 'coordinator@42.nl',
              value: coordinatorUser
            },
            {
              label: 'user@42.nl',
              value: userUser
            }
          ]
        });

        done();
      } catch (error) {
        console.error(error);
        done.fail();
      }
    });

    describe('value changes', () => {
      test('becomes empty', () => {
        setup({ value: [adminUser] });

        let asyncTypeahead = typeaheadMultiple
          .find('div')
          .children()
          .first();
        expect(asyncTypeahead.props().selected).toEqual([
          {
            label: 'admin@42.nl',
            value: adminUser
          }
        ]);

        typeaheadMultiple.setProps({ value: undefined });

        asyncTypeahead = typeaheadMultiple
          .find('div')
          .children()
          .first();
        expect(asyncTypeahead.props().selected).toEqual([]);

        expect(typeaheadMultiple.find('.showing-placeholder').length).toBe(1);
      });

      test('becomes filled', () => {
        setup({ value: undefined });

        let asyncTypeahead = typeaheadMultiple
          .find('div')
          .children()
          .first();
        expect(asyncTypeahead.props().selected).toEqual([]);

        typeaheadMultiple.setProps({
          value: [adminUser]
        });

        asyncTypeahead = typeaheadMultiple
          .find('div')
          .children()
          .first();
        expect(asyncTypeahead.props().selected).toEqual([
          {
            label: 'admin@42.nl',
            value: adminUser
          }
        ]);

        expect(typeaheadMultiple.find('.showing-placeholder').length).toBe(0);
      });
    });
  });
});
