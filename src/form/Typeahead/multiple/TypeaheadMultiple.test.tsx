import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import TypeaheadMultiple from './TypeaheadMultiple';

import {
  adminUser,
  coordinatorUser,
  pageOfUsers,
  userUser
} from '../../../test/fixtures';
import { User } from '../../../test/types';
import { resolvablePromise, waitForUI } from '../../../test/utils';

describe('Component: TypeaheadMultiple', () => {
  function setup({
    value,
    hasPlaceholder = true,
    hasLabel = true
  }: {
    value?: User[];
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

    const typeaheadMultiple = shallow(
      <TypeaheadMultiple {...props} {...labelProps} />
    );

    return { typeaheadMultiple, optionsSpy, onChangeSpy, onBlurSpy };
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

    test('without label', () => {
      const { typeaheadMultiple } = setup({
        value: [adminUser()],
        hasLabel: false
      });

      expect(toJson(typeaheadMultiple)).toMatchSnapshot(
        'Component: TypeaheadMultiple => ui => without label'
      );
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

    it('should fetch options when the user starts typing in the input field', async () => {
      expect.assertions(4);

      const { typeaheadMultiple, optionsSpy } = setup({
        value: undefined
      });

      const { resolve, promise } = resolvablePromise();

      optionsSpy.mockReturnValue(promise);

      let asyncTypeahead = typeaheadMultiple.find('div').children().first();

      asyncTypeahead.props().onSearch('Ma');

      await waitForUI(() => {
        asyncTypeahead = typeaheadMultiple.find('div').children().first();

        expect(asyncTypeahead.props().isLoading).toBe(true);
      });

      resolve(pageOfUsers());

      await waitForUI(() => {
        asyncTypeahead = typeaheadMultiple.find('div').children().first();

        expect(asyncTypeahead.props().isLoading).toBe(false);
      });

      asyncTypeahead = typeaheadMultiple.find('div').children().first();

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
