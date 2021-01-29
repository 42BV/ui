import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { emptyPage, Page } from '@42.nl/spring-connect';

import ModalPickerMultiple from './ModalPickerMultiple';
import {
  adminUser,
  coordinatorUser,
  listOfUsers,
  pageOfUsersFetcher,
  randomUser,
  userUser
} from '../../../test/fixtures';

import { User } from '../../../test/types';
import * as testUtils from '../../../test/utils';
import { ModalPickerButtonAlignment } from '../types';
import { pageOf } from '../../../utilities/page/page';
import { useOptions } from '../../useOptions';
import { Color } from '../../../core/types';
import { IsOptionEnabled } from '../../option';
import { icons } from '../../../core/Icon';
import { ModalPickerOpener } from '../ModalPickerOpener/ModalPickerOpener';
import TextButton from '../../../core/TextButton/TextButton';

jest.mock('../../useOptions', () => {
  return { useOptions: jest.fn() };
});

describe('Component: ModalPickerMultiple', () => {
  function setup({
    value,
    showAddButton = false,
    canSearch = undefined,
    hasLabel = true,
    alignButton,
    hasRenderValue = false,
    hasRenderOptions = false,
    loading = false,
    empty = false,
    reUsePage = false,
    isOptionEnabled,
    isAsync = false,
    canClear
  }: {
    value?: User[];
    showAddButton?: boolean;
    canSearch?: boolean;
    hasLabel?: boolean;
    spyOnRenderOptions?: boolean;
    alignButton?: ModalPickerButtonAlignment;
    hasRenderValue?: boolean;
    hasRenderOptions?: boolean;
    loading?: boolean;
    empty?: boolean;
    reUsePage?: boolean;
    isOptionEnabled?: IsOptionEnabled<User>;
    isAsync?: boolean;
    canClear?: boolean;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();
    const addButtonCallbackSpy = jest.fn();

    // We might reuse the page so it can be unshifted by `addButtonClicked`
    let page: Page<User> | undefined = undefined;

    let doInitialCheck = true;
    // @ts-expect-error This is in fact a mock
    useOptions.mockImplementation(
      ({ pageNumber, query, size, optionsShouldAlwaysContainValue }) => {
        if (doInitialCheck) {
          expect(pageNumber).toBe(1);
          expect(query).toBe('');
          expect(size).toBe(10);
          expect(optionsShouldAlwaysContainValue).toBe(false);
          doInitialCheck = false;
        }

        if (!page || !reUsePage) {
          page = empty ? emptyPage() : pageOf(listOfUsers(), pageNumber, size);
        }

        return {
          page,
          loading
        };
      }
    );

    const addButton = showAddButton
      ? { label: 'Add color', onClick: addButtonCallbackSpy }
      : undefined;

    const props = {
      name: 'bestFriend',
      placeholder: 'Select your best friend',
      icon: icons['face'],
      canSearch,
      options: isAsync ? pageOfUsersFetcher : listOfUsers(),
      labelForOption: (user: User) => user.email,
      isOptionEnabled,
      addButton,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      alignButton,
      renderValue: hasRenderValue
        ? (users?: User[]) => (
            <span>
              {users
                ? users.map((user) => user.id).join(', ')
                : 'none selected'}
            </span>
          )
        : undefined,
      renderOptions: hasRenderOptions
        ? () => <span>RenderOptions</span>
        : undefined,
      color: 'success' as Color,
      canClear
    };

    const labelProps = hasLabel
      ? { id: 'bestFriend', label: 'Best Friend' }
      : {};

    const modalPickerMultiple = shallow(
      <ModalPickerMultiple {...props} {...labelProps} />
    );

    return {
      modalPickerMultiple,
      onChangeSpy,
      onBlurSpy,
      addButtonCallbackSpy,
      page
    };
  }

  describe('ui', () => {
    it('should render', () => {
      const { modalPickerMultiple } = setup({
        value: [adminUser(), userUser()]
      });

      expect(toJson(modalPickerMultiple)).toMatchSnapshot(
        'Component: ModalPickerMultiple => ui => should render'
      );
    });

    it('should not render search canSearch is false', () => {
      const { modalPickerMultiple } = setup({
        value: [adminUser(), userUser()],

        canSearch: false
      });

      // @ts-expect-error Test mock
      expect(modalPickerMultiple.find('ModalPicker').props().canSearch).toBe(
        false
      );
    });

    it('should render multiple labels with the selected values when the value array is not empty', () => {
      const { modalPickerMultiple } = setup({
        value: [adminUser(), userUser()]
      });

      expect(
        modalPickerMultiple.find('ModalPickerOpener').props().value
      ).toEqual([adminUser(), userUser()]);
    });

    it('should render no labels when the value array is empty', () => {
      const { modalPickerMultiple } = setup({ value: undefined });

      expect(
        modalPickerMultiple.find('ModalPickerOpener').props().value
      ).toBeUndefined();
    });

    it('should render multiple labels inside the modal with the selected values when the selected property is not empty', () => {
      const { modalPickerMultiple } = setup({
        value: [adminUser(), userUser()]
      });

      // Open the modal
      modalPickerMultiple
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      expect(
        modalPickerMultiple
          .find('Tag')
          .at(0)
          // @ts-expect-error Test mock
          .props().text
      ).toBe('admin@42.nl');

      expect(
        modalPickerMultiple
          .find('Tag')
          .at(1)
          // @ts-expect-error Test mock
          .props().text
      ).toBe('user@42.nl');
    });

    it('should render no labels inside the modal when the selected property is empty', () => {
      const { modalPickerMultiple } = setup({ value: undefined });

      // Open the modal
      modalPickerMultiple
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      expect(modalPickerMultiple.find('Tag').exists()).toBe(false);
    });

    it('should render properly without label', () => {
      const { modalPickerMultiple } = setup({
        value: [adminUser(), userUser()],

        hasLabel: false
      });

      expect(toJson(modalPickerMultiple)).toMatchSnapshot(
        'Component: ModalPickerMultiple => ui => should render properly without label'
      );
    });

    it('should render the options with the correct checked state', () => {
      const { modalPickerMultiple } = setup({
        value: [adminUser(), coordinatorUser()]
      });

      // Open the modal
      modalPickerMultiple
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      const admin = modalPickerMultiple.find('Input').at(0);
      const coordinator = modalPickerMultiple.find('Input').at(1);
      const user = modalPickerMultiple.find('Input').at(2);

      expect(admin.props().checked).toBe(true);
      expect(coordinator.props().checked).toBe(true);
      expect(user.props().checked).toBe(false);

      expect(toJson(modalPickerMultiple)).toMatchSnapshot(
        'Component: ModalPickerMultiple => ui => should render the options with the correct checked state'
      );
    });

    it('should disable options when isOptionEnabled is false', () => {
      const { modalPickerMultiple } = setup({
        isOptionEnabled: (user) => user.email === 'admin@42.nl'
      });

      // Open the modal
      modalPickerMultiple
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      const admin = modalPickerMultiple.find('Input').at(0);
      const coordinator = modalPickerMultiple.find('Input').at(1);
      const user = modalPickerMultiple.find('Input').at(2);

      expect(admin.props().disabled).toBe(false);
      expect(coordinator.props().disabled).toBe(true);
      expect(user.props().disabled).toBe(true);
    });

    it('should render button left', () => {
      const { modalPickerMultiple } = setup({
        value: [adminUser()],

        alignButton: 'left'
      });
      expect(toJson(modalPickerMultiple)).toMatchSnapshot(
        'Component: ModalPickerMultiple => ui => should render button left'
      );
    });

    it('should render button right without value', () => {
      const { modalPickerMultiple } = setup({
        value: undefined,
        alignButton: 'right'
      });
      expect(toJson(modalPickerMultiple)).toMatchSnapshot(
        'Component: ModalPickerMultiple => ui => should render button right without value'
      );
    });

    it('should render button right with value', () => {
      const { modalPickerMultiple } = setup({
        value: [adminUser()],

        alignButton: 'right'
      });
      expect(toJson(modalPickerMultiple)).toMatchSnapshot(
        'Component: ModalPickerMultiple => ui => should render button right with value'
      );
    });

    it('should render without clear button', () => {
      const { modalPickerMultiple } = setup({
        value: [adminUser()],
        canClear: false
      });
      expect(
        modalPickerMultiple.find(ModalPickerOpener).find(TextButton).exists()
      ).toBe(false);
    });

    describe('renderValue', () => {
      it('should be able to use custom function to render values', () => {
        const { modalPickerMultiple } = setup({
          value: [adminUser()],
          hasRenderValue: true
        });

        expect(toJson(modalPickerMultiple)).toMatchSnapshot(
          'Component: ModalPickerMultiple => ui => should be able to use custom function to render values'
        );
      });

      it('should use the default ModalPickerValueTruncator to render values', () => {
        const { modalPickerMultiple } = setup({
          value: [adminUser()],
          hasRenderValue: false
        });

        const renderValue = modalPickerMultiple
          .find('ModalPickerOpener')
          // @ts-expect-error Test mock
          .renderProp('renderValue');

        expect(toJson(renderValue(adminUser()))).toMatchSnapshot(
          'Component: ModalPickerMultiple => ui => should use the default ModalPickerValueTruncator to render values'
        );

        const modalPicker = modalPickerMultiple.find('ModalPicker').props();

        // @ts-expect-error Mock test
        expect(modalPicker.renderOptionsConfig).toBe(undefined);
      });
    });

    it('should be able to use custom function to render options', () => {
      const { modalPickerMultiple } = setup({
        value: [adminUser()],
        hasRenderOptions: true
      });

      const modalPicker = modalPickerMultiple.find('ModalPicker').props();

      // @ts-expect-error Mock test
      expect(modalPicker.renderOptionsConfig).toMatchInlineSnapshot(`
        Object {
          "isOptionEnabled": [Function],
          "isOptionEqual": undefined,
          "keyForOption": undefined,
          "labelForOption": [Function],
          "onChange": [Function],
          "renderOptions": [Function],
        }
      `);
    });

    test('loading', () => {
      const { modalPickerMultiple } = setup({
        loading: true
      });

      const modalPicker = modalPickerMultiple.find('ModalPicker').at(0).props();

      // @ts-expect-error Test mock
      expect(modalPicker.loading).toBe(true);
    });

    test('async debounce', () => {
      const { modalPickerMultiple } = setup({
        isAsync: true
      });

      const modalPicker = modalPickerMultiple.find('ModalPicker').at(0).props();
      // @ts-expect-error Test mock
      expect(modalPicker.canSearchSync).toBe(false);
    });

    test('sync debounce', () => {
      const { modalPickerMultiple } = setup({
        isAsync: false
      });

      const modalPicker = modalPickerMultiple.find('ModalPicker').at(0).props();
      // @ts-expect-error Test mock
      expect(modalPicker.canSearchSync).toBe(true);
    });
  });

  describe('events', () => {
    it('should open the modal when the select button is clicked', () => {
      const { modalPickerMultiple } = setup({
        value: [adminUser(), coordinatorUser()]
      });

      // Open the modal
      modalPickerMultiple
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      // Now expect the admin, and coordinator to be selected which are the first and second options
      const inputs = modalPickerMultiple.find('Input');
      expect(inputs.at(0).props().checked).toBe(true);
      expect(inputs.at(1).props().checked).toBe(true);
      expect(inputs.at(2).props().checked).toBe(false);

      const modalPicker = modalPickerMultiple.find('ModalPicker').props();

      // Expect the modal to open
      // @ts-expect-error Test mock
      expect(modalPicker.isOpen).toBe(true);

      // Expect the query to be reset
      // @ts-expect-error Test mock
      expect(modalPicker.query).toBe('');

      // Expect the page to be reset
      // @ts-expect-error Test mock
      expect(modalPicker.page.number).toBe(1);

      // Expect userHasSearched to be reset to false
      // @ts-expect-error Test mock
      expect(modalPicker.userHasSearched).toBe(false);
    });

    it('should fetch options when the user searches', () => {
      const { modalPickerMultiple } = setup({
        value: undefined
      });

      let modalPicker = modalPickerMultiple.find('ModalPicker').props();

      // @ts-expect-error Test mock
      modalPicker.queryChanged('tes');

      expect(useOptions).toHaveBeenLastCalledWith(
        expect.objectContaining({ query: 'tes', pageNumber: 1 })
      );

      modalPicker = modalPickerMultiple.find('ModalPicker').props();

      // Expect the query to be reset
      // @ts-expect-error Test mock
      expect(modalPicker.query).toBe('tes');

      // Expect the page to be reset
      // @ts-expect-error Test mock
      expect(modalPicker.page.number).toBe(1);

      // Expect userHasSearched to be true
      // @ts-expect-error Test mock
      expect(modalPicker.userHasSearched).toBe(true);
    });

    it('should when the user moves to another page load the new page', () => {
      const { modalPickerMultiple } = setup({
        value: undefined
      });

      let modalPicker = modalPickerMultiple.find('ModalPicker').props();

      // @ts-expect-error Test mock
      modalPicker.pageChanged(2);

      expect(useOptions).toHaveBeenLastCalledWith(
        expect.objectContaining({ pageNumber: 2 })
      );

      modalPicker = modalPickerMultiple.find('ModalPicker').props();

      // Expect the page to be reset
      // @ts-expect-error Test mock
      expect(modalPicker.page.number).toBe(2);
    });

    it('should when the user closes the modal the modal close the modal without calling onChange', () => {
      const { modalPickerMultiple, onChangeSpy, onBlurSpy } = setup({
        value: undefined
      });

      // Open the modal
      modalPickerMultiple
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      modalPickerMultiple
        .find('ModalPicker')
        .at(0)
        .props()
        // @ts-expect-error Test mock
        .closeModal();

      const modalPicker = modalPickerMultiple.find('ModalPicker').props();

      // Expect the modal to be closed
      // @ts-expect-error Test mock
      expect(modalPicker.isOpen).toBe(false);

      // Nothing should have been selected
      expect(onChangeSpy).toHaveBeenCalledTimes(0);
      expect(onBlurSpy).toHaveBeenCalledTimes(0);
    });

    it('should when the user clicks save, it should close the modal and select the value', () => {
      const { modalPickerMultiple, onChangeSpy, onBlurSpy } = setup({
        value: undefined
      });

      // Open the modal
      modalPickerMultiple
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      const inputs = modalPickerMultiple.find('Input');

      // Check that the first input is not selected yet
      const adminInput = inputs.at(0).props();
      expect(adminInput.checked).toBe(false);

      // Now select the admin and coordinator
      // @ts-expect-error Test mock
      adminInput.onChange();

      modalPickerMultiple
        .find('ModalPicker')
        .at(0)
        .props()
        // @ts-expect-error Test mock
        .modalSaved();

      const modalPicker = modalPickerMultiple.find('ModalPicker').props();

      // Expect the modal to be closed
      // @ts-expect-error Test mock
      expect(modalPicker.isOpen).toBe(false);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith([adminUser()]);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('should when the user clicks the clear button clear the value', () => {
      const { modalPickerMultiple, onChangeSpy } = setup({
        value: [adminUser(), coordinatorUser()]
      });

      // Open the modal
      modalPickerMultiple
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      modalPickerMultiple
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .onClear();

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(undefined);
    });

    it('should when the user removes a selected value via the tag inside the modal it should be removed after pressing save', () => {
      const { modalPickerMultiple, onChangeSpy } = setup({
        value: [adminUser()]
      });

      // Open the modal
      modalPickerMultiple
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      const adminTag = modalPickerMultiple.find('Tag').at(0);

      // @ts-expect-error Test mock
      adminTag.props().onRemove();

      modalPickerMultiple
        .find('ModalPicker')
        .at(0)
        .props()
        // @ts-expect-error Test mock
        .modalSaved();

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith([]);
    });

    describe('addButton', () => {
      it('should add an item on the first position, when the promise resolves', async (done) => {
        expect.assertions(9);

        const { modalPickerMultiple, addButtonCallbackSpy, page } = setup({
          value: undefined,
          showAddButton: true,
          reUsePage: true
        });

        // Open the modal
        modalPickerMultiple
          .find('ModalPickerOpener')
          .props()
          // @ts-expect-error Test mock
          .openModal();

        const { promise, resolve } = testUtils.resolvablePromise();
        addButtonCallbackSpy.mockReturnValueOnce(promise);

        modalPickerMultiple
          .find('ModalPicker')
          .at(0)
          .props()
          // @ts-expect-error Test mock
          .addButton.onClick();

        // Expect the modal to be closed
        const modalPicker = modalPickerMultiple.find('ModalPicker').props();
        // @ts-expect-error Test mock
        expect(modalPicker.isOpen).toBe(false);

        expect(addButtonCallbackSpy).toHaveBeenCalledTimes(1);

        const addedUser = randomUser();
        resolve(addedUser);

        try {
          await promise;

          testUtils.waitForUI(() => {
            const modalPicker = modalPickerMultiple.find('ModalPicker').props();

            // @ts-expect-error Test mock
            expect(modalPicker.isOpen).toBe(true);

            if (page) {
              // Test that the new user is prepended
              // @ts-expect-error Test mock
              expect(page.content).toEqual([
                addedUser,
                adminUser(),
                coordinatorUser(),
                userUser()
              ]);
            }

            // Test that the user is selected
            expect(modalPicker.selected).toEqual([addedUser]);

            done();
          });
        } catch (error) {
          console.error(error);
          done.fail();
        }
      });

      it('should hide when the promise is rejected', async (done) => {
        expect.assertions(7);

        const { modalPickerMultiple, addButtonCallbackSpy } = setup({
          value: undefined,
          showAddButton: true
        });

        // Open the modal
        modalPickerMultiple
          .find('ModalPickerOpener')
          .props()
          // @ts-expect-error Test mock
          .openModal();

        const { promise, reject } = testUtils.rejectablePromise();
        addButtonCallbackSpy.mockReturnValueOnce(promise);

        modalPickerMultiple
          .find('ModalPicker')
          .at(0)
          .props()
          // @ts-expect-error Test mock
          .addButton.onClick();

        // Expect the modal to be closed
        const modalPicker = modalPickerMultiple.find('ModalPicker').props();
        // @ts-expect-error Test mock
        expect(modalPicker.isOpen).toBe(false);

        expect(addButtonCallbackSpy).toHaveBeenCalledTimes(1);

        reject();

        try {
          await promise;
          done.fail();
        } catch (error) {
          testUtils.waitForUI(() => {
            // Expect the modal to be opened
            const modalPicker = modalPickerMultiple.find('ModalPicker').props();
            // @ts-expect-error Test mock
            expect(modalPicker.isOpen).toBe(true);

            done();
          });
        }
      });
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      const value = [adminUser()];

      const { modalPickerMultiple } = setup({ value: value });

      expect(
        modalPickerMultiple.find('ModalPickerOpener').props().value
      ).toEqual(value);

      modalPickerMultiple.setProps({ value: undefined });

      expect(
        modalPickerMultiple.find('ModalPickerOpener').props().value
      ).toBeUndefined();
    });

    test('becomes filled', () => {
      const { modalPickerMultiple } = setup({ value: undefined });

      expect(
        modalPickerMultiple.find('ModalPickerOpener').props().value
      ).toBeUndefined();

      modalPickerMultiple.setProps({
        value: [adminUser()]
      });

      expect(
        modalPickerMultiple.find('ModalPickerOpener').props().value
      ).toEqual([adminUser()]);
    });
  });
});
