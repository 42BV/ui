import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import TypeaheadSingle from './TypeaheadSingle';

import {
  adminUser,
  coordinatorUser,
  pageOfUsers,
  userUser
} from '../../../test/fixtures';
import { User } from '../../../test/types';

describe('Component: TypeaheadSingle', () => {
  let typeaheadSingle: ShallowWrapper;

  let fetchOptionsSpy: jest.Mock<any, any>;
  let onChangeSpy: jest.Mock<any, any>;
  let onBlurSpy: jest.Mock<any, any>;

  function setup({
    value,
    hasPlaceholder = true,
    hasLabel = true
  }: {
    value?: User;
    hasPlaceholder?: boolean;
    hasLabel?: boolean;
  }) {
    fetchOptionsSpy = jest.fn();
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();

    const props = {
      placeholder: hasPlaceholder
        ? 'Please provide your best friend'
        : undefined,
      optionForValue: (user: User) => user.email,
      fetchOptions: fetchOptionsSpy,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error'
    };

    if (hasLabel) {
      typeaheadSingle = shallow(
        <TypeaheadSingle id="bestFriend" label="Best friend" {...props} />
      );
    } else {
      typeaheadSingle = shallow(<TypeaheadSingle {...props} />);
    }
  }

  describe('ui', () => {
    test('with value', () => {
      setup({ value: adminUser });

      expect(toJson(typeaheadSingle)).toMatchSnapshot(
        'Component: TypeaheadSingle => ui => with value'
      );
    });

    test('without placeholder', () => {
      setup({ value: adminUser, hasPlaceholder: false });

      expect(toJson(typeaheadSingle)).toMatchSnapshot(
        'Component: TypeaheadSingle => ui => without placeholder'
      );
    });

    test('without label', () => {
      setup({ value: adminUser, hasLabel: false });

      expect(toJson(typeaheadSingle)).toMatchSnapshot(
        'Component: TypeaheadSingle => ui => without label'
      );
    });
  });

  describe('events', () => {
    describe('onChange', () => {
      test('nothing selected', () => {
        setup({ value: undefined });

        const asyncTypeahead = typeaheadSingle
          .find('div')
          .children()
          .first();

        asyncTypeahead.props().onChange([]);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(undefined);
      });

      test('value selected', () => {
        setup({ value: undefined });

        const asyncTypeahead = typeaheadSingle
          .find('div')
          .children()
          .first();

        asyncTypeahead.props().onChange([
          {
            label: 'Maarten',
            value: adminUser
          }
        ]);

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(adminUser);

        expect(onBlurSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('fetchOptions', () => {
      test('value does not match query', async done => {
        setup({ value: undefined });

        const promise = Promise.resolve(pageOfUsers);

        fetchOptionsSpy.mockReturnValue(promise);

        const asyncTypeahead = typeaheadSingle
          .find('div')
          .children()
          .first();

        asyncTypeahead.props().onSearch('Ma');

        try {
          await promise;

          expect(typeaheadSingle.state()).toEqual({
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

          expect(onChangeSpy).toHaveBeenCalledTimes(1);
          expect(onChangeSpy).toHaveBeenCalledWith(undefined);
          done();
        } catch (error) {
          console.error(error);
          done.fail();
        }
      });

      test('value matches query', async done => {
        setup({ value: undefined });

        const promise = Promise.resolve(pageOfUsers);

        fetchOptionsSpy.mockReturnValue(promise);

        const asyncTypeahead = typeaheadSingle
          .find('div')
          .children()
          .first();

        asyncTypeahead.props().onSearch('admin@42.nl');

        try {
          await promise;

          expect(typeaheadSingle.state()).toEqual({
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

          expect(onChangeSpy).toHaveBeenCalledTimes(1);
          expect(onChangeSpy).toHaveBeenCalledWith(adminUser);

          done();
        } catch (error) {
          console.error(error);
          done.fail();
        }
      });
    });

    describe('value changes', () => {
      test('becomes empty', () => {
        setup({ value: adminUser });

        let asyncTypeahead = typeaheadSingle
          .find('div')
          .children()
          .first();

        expect(asyncTypeahead.props().selected).toEqual([
          {
            label: 'admin@42.nl',
            value: adminUser
          }
        ]);

        typeaheadSingle.setProps({ value: undefined });

        asyncTypeahead = typeaheadSingle
          .find('div')
          .children()
          .first();
        expect(asyncTypeahead.props().selected).toEqual([]);

        expect(typeaheadSingle.find('.showing-placeholder').length).toBe(1);
      });

      test('becomes filled', () => {
        setup({ value: undefined });

        let asyncTypeahead = typeaheadSingle
          .find('div')
          .children()
          .first();
        expect(asyncTypeahead.props().selected).toEqual([]);

        typeaheadSingle.setProps({
          value: adminUser
        });

        asyncTypeahead = typeaheadSingle
          .find('div')
          .children()
          .first();
        expect(asyncTypeahead.props().selected).toEqual([
          {
            label: 'admin@42.nl',
            value: adminUser
          }
        ]);

        expect(typeaheadSingle.find('.showing-placeholder').length).toBe(0);
      });
    });
  });
});
