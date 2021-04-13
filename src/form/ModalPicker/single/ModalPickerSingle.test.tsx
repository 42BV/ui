import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { emptyPage, Page } from '@42.nl/spring-connect';

import ModalPickerSingle from './ModalPickerSingle';
import { User } from '../../../test/types';
import * as testUtils from '../../../test/utils';
import {
  adminUser,
  coordinatorUser,
  listOfUsers,
  pageOfUsersFetcher,
  randomUser,
  userUser
} from '../../../test/fixtures';
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

describe('Component: ModalPickerSingle', () => {
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
    canClear,
    pageSize = 10
  }: {
    value?: User;
    showAddButton?: boolean;
    canSearch?: boolean;
    hasLabel?: boolean;
    alignButton?: ModalPickerButtonAlignment;
    hasRenderValue?: boolean;
    hasRenderOptions?: boolean;
    loading?: boolean;
    empty?: boolean;
    reUsePage?: boolean;
    isOptionEnabled?: IsOptionEnabled<User>;
    isAsync?: boolean;
    canClear?: boolean;
    pageSize?: number;
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
          expect(size).toBe(pageSize);
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
      options: isAsync ? pageOfUsersFetcher : listOfUsers(),
      labelForOption: (user: User) => user.email,
      isOptionEnabled,
      canSearch,
      addButton,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      alignButton,
      renderValue: hasRenderValue
        ? (user?: User) => <span>{user ? user.id : 'none selected'}</span>
        : undefined,
      renderOptions: hasRenderOptions
        ? () => <span>RenderOptions</span>
        : undefined,
      color: 'success' as Color,
      canClear,
      pageSize
    };

    const labelProps = hasLabel
      ? { id: 'bestFriend', label: 'Best Friend' }
      : {};

    const modalPickerSingle = shallow(
      <ModalPickerSingle {...props} {...labelProps} />
    );

    return {
      modalPickerSingle,
      onChangeSpy,
      onBlurSpy,
      addButtonCallbackSpy,
      page
    };
  }

  describe('ui', () => {
    it('should render', () => {
      const { modalPickerSingle } = setup({
        value: adminUser()
      });
      expect(toJson(modalPickerSingle)).toMatchSnapshot(
        'Component: ModalPickerSingle => ui => should render'
      );
    });

    it('should not render search canSearch is false', () => {
      const { modalPickerSingle } = setup({
        value: adminUser(),
        canSearch: false
      });

      // @ts-expect-error Test mock
      expect(modalPickerSingle.find('ModalPicker').props().canSearch).toBe(
        false
      );
    });

    it('should render a label with the selected value when the value is not empty', () => {
      const value = adminUser();
      const { modalPickerSingle } = setup({ value });
      expect(modalPickerSingle.find('ModalPickerOpener').props().value).toEqual(
        value
      );
    });

    it('should not render a label when the value is empty', () => {
      const { modalPickerSingle } = setup({
        value: undefined
      });
      expect(
        // @ts-expect-error Test mock
        modalPickerSingle.find('ModalPickerOpener').props.value
      ).toBeUndefined();
    });

    it('should render without label', () => {
      const { modalPickerSingle } = setup({
        value: adminUser(),
        hasLabel: false
      });
      expect(toJson(modalPickerSingle)).toMatchSnapshot(
        'Component: ModalPickerSingle => ui => should render without label'
      );
    });

    it('should render the options with the correct checked state', () => {
      const { modalPickerSingle } = setup({
        value: adminUser()
      });

      // Open the modal
      modalPickerSingle
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      const admin = modalPickerSingle.find('Input').at(0);
      const coordinator = modalPickerSingle.find('Input').at(1);
      const user = modalPickerSingle.find('Input').at(2);

      expect(admin.props().checked).toBe(true);
      expect(coordinator.props().checked).toBe(false);
      expect(user.props().checked).toBe(false);
    });

    it('should disable options when isOptionEnabled is false', () => {
      const { modalPickerSingle } = setup({
        isOptionEnabled: (user) => user.email === 'admin@42.nl'
      });

      // Open the modal
      modalPickerSingle
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      expect(modalPickerSingle.find('Input')).toHaveLength(3);
      const admin = modalPickerSingle.find('Input').at(0);
      const coordinator = modalPickerSingle.find('Input').at(1);
      const user = modalPickerSingle.find('Input').at(2);

      expect(admin.props().disabled).toBe(false);
      expect(coordinator.props().disabled).toBe(true);
      expect(user.props().disabled).toBe(true);
    });

    it('should only render 2 options when pageSize is set to 2', () => {
      const { modalPickerSingle } = setup({
        value: adminUser(),
        pageSize: 2
      });

      // Open the modal
      modalPickerSingle
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      expect(modalPickerSingle.find('Input')).toHaveLength(2);
      const admin = modalPickerSingle.find('Input').at(0);
      const coordinator = modalPickerSingle.find('Input').at(1);

      expect(admin.props().checked).toBe(true);
      expect(coordinator.props().checked).toBe(false);
    });

    it('should render button left', () => {
      const { modalPickerSingle } = setup({
        value: adminUser(),
        alignButton: 'left'
      });
      expect(toJson(modalPickerSingle)).toMatchSnapshot(
        'Component: ModalPickerSingle => ui => should render button left'
      );
    });

    it('should render button right without value', () => {
      const { modalPickerSingle } = setup({
        value: undefined,
        alignButton: 'right'
      });
      expect(toJson(modalPickerSingle)).toMatchSnapshot(
        'Component: ModalPickerSingle => ui => should render button right without value'
      );
    });

    it('should render button right with value', () => {
      const { modalPickerSingle } = setup({
        value: adminUser(),
        alignButton: 'right'
      });
      expect(toJson(modalPickerSingle)).toMatchSnapshot(
        'Component: ModalPickerSingle => ui => should render button right with value'
      );
    });

    it('should render without clear button', () => {
      const { modalPickerSingle } = setup({
        value: adminUser(),
        canClear: false
      });
      expect(
        modalPickerSingle.find(ModalPickerOpener).find(TextButton).exists()
      ).toBe(false);
    });

    describe('renderValue', () => {
      it('should be able to use custom function to render values', () => {
        const { modalPickerSingle } = setup({
          value: adminUser(),
          hasRenderValue: true
        });

        expect(toJson(modalPickerSingle)).toMatchSnapshot(
          'Component: ModalPickerSingle => ui => should be able to use custom function to render values'
        );
      });

      it('should use the default ModalPickerValueTruncator to render values', () => {
        const { modalPickerSingle } = setup({
          value: adminUser(),
          hasRenderValue: false
        });

        const renderValue = modalPickerSingle
          .find('ModalPickerOpener')
          // @ts-expect-error Test mock
          .renderProp('renderValue');

        expect(toJson(renderValue(adminUser()))).toMatchSnapshot(
          'Component: ModalPickerSingle => ui => should use the default ModalPickerValueTruncator to render values'
        );

        const modalPicker = modalPickerSingle.find('ModalPicker').props();

        // @ts-expect-error Mock test
        expect(modalPicker.renderOptionsConfig).toBe(undefined);
      });
    });

    it('should be able to use custom function to render options', () => {
      const { modalPickerSingle } = setup({
        value: adminUser(),
        hasRenderOptions: true
      });

      const modalPicker = modalPickerSingle.find('ModalPicker').props();

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
      const { modalPickerSingle } = setup({
        loading: true
      });

      const modalPicker = modalPickerSingle.find('ModalPicker').at(0).props();

      // @ts-expect-error Test mock
      expect(modalPicker.loading).toBe(true);
    });

    test('async debounce', () => {
      const { modalPickerSingle } = setup({
        isAsync: true
      });

      const modalPicker = modalPickerSingle.find('ModalPicker').at(0).props();
      // @ts-expect-error Test mock
      expect(modalPicker.canSearchSync).toBe(false);
    });

    test('sync debounce', () => {
      const { modalPickerSingle } = setup({
        isAsync: false
      });

      const modalPicker = modalPickerSingle.find('ModalPicker').at(0).props();
      // @ts-expect-error Test mock
      expect(modalPicker.canSearchSync).toBe(true);
    });
  });

  describe('events', () => {
    it('should open the modal when the select button is clicked', () => {
      const { modalPickerSingle } = setup({
        value: adminUser()
      });

      // Open the modal
      modalPickerSingle
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      // Now expect only the admin to be selected which is the first option
      const inputs = modalPickerSingle.find('Input');
      expect(inputs.at(0).props().checked).toBe(true);
      expect(inputs.at(1).props().checked).toBe(false);
      expect(inputs.at(2).props().checked).toBe(false);

      const modalPicker = modalPickerSingle.find('ModalPicker').props();

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
      const { modalPickerSingle } = setup({
        value: undefined
      });

      let modalPicker = modalPickerSingle.find('ModalPicker').props();

      // @ts-expect-error Test mock
      modalPicker.queryChanged('tes');

      expect(useOptions).toHaveBeenLastCalledWith(
        expect.objectContaining({ query: 'tes', pageNumber: 1 })
      );

      modalPicker = modalPickerSingle.find('ModalPicker').props();

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
      const { modalPickerSingle } = setup({
        value: undefined
      });

      let modalPicker = modalPickerSingle.find('ModalPicker').props();

      // @ts-expect-error Test mock
      modalPicker.pageChanged(2);

      expect(useOptions).toHaveBeenLastCalledWith(
        expect.objectContaining({ pageNumber: 2 })
      );

      modalPicker = modalPickerSingle.find('ModalPicker').props();

      // Expect the page to be reset
      // @ts-expect-error Test mock
      expect(modalPicker.page.number).toBe(2);
    });

    it('should when the user closes the modal the modal close the modal without calling onChange', () => {
      const { modalPickerSingle, onChangeSpy } = setup({
        value: undefined
      });

      // Open the modal
      modalPickerSingle
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      modalPickerSingle
        .find('ModalPicker')
        .at(0)
        .props()
        // @ts-expect-error Test mock
        .closeModal();

      const modalPicker = modalPickerSingle.find('ModalPicker').props();

      // Expect the modal to be closed
      // @ts-expect-error Test mock
      expect(modalPicker.isOpen).toBe(false);

      // Nothing should have been selected
      expect(onChangeSpy).toHaveBeenCalledTimes(0);
    });

    it('should when the user clicks save it should close the modal and select the value', () => {
      const { modalPickerSingle, onChangeSpy } = setup({
        value: undefined
      });

      // Open the modal
      modalPickerSingle
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      // Check that the first input is not selected yet
      const input = modalPickerSingle.find('Input').at(0).props();
      expect(input.checked).toBe(false);

      // Now select the admin
      // @ts-expect-error Test mock
      input.onChange();

      modalPickerSingle
        .find('ModalPicker')
        .at(0)
        .props()
        // @ts-expect-error Test mock
        .modalSaved();

      const modalPicker = modalPickerSingle.find('ModalPicker').props();

      // Expect the modal to be closed
      // @ts-expect-error Test mock
      expect(modalPicker.isOpen).toBe(false);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(adminUser());
    });

    it('should when the user clicks the clear button clear the value', () => {
      const { modalPickerSingle, onChangeSpy } = setup({ value: adminUser() });

      // Open the modal
      modalPickerSingle
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .openModal();

      modalPickerSingle
        .find('ModalPickerOpener')
        .props()
        // @ts-expect-error Test mock
        .onClear();

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(undefined);
    });

    it('should when the user selects an option store the value but do not call onChange', () => {
      const { modalPickerSingle } = setup({
        value: adminUser()
      });

      // @ts-expect-error Test mock
      modalPickerSingle
        .find('Input')
        .at(1)
        .props()
        // @ts-expect-error Test mock
        .onChange();

      let modalPicker = modalPickerSingle.find('ModalPicker').props();
      expect(modalPicker.selected).toEqual(coordinatorUser());

      // @ts-expect-error Test mock
      modalPickerSingle
        .find('Input')
        .at(2)
        .props()
        // @ts-expect-error Test mock
        .onChange();

      modalPicker = modalPickerSingle.find('ModalPicker').props();
      expect(modalPicker.selected).toEqual(userUser());

      // @ts-expect-error Test mock
      modalPickerSingle
        .find('Input')
        .at(0)
        .props()
        // @ts-expect-error Test mock
        .onChange();

      modalPicker = modalPickerSingle.find('ModalPicker').props();
      expect(modalPicker.selected).toEqual(adminUser());
    });

    describe('addButton', () => {
      it('should add an item on the first position, when the promise resolves', async (done) => {
        expect.assertions(9);

        const { modalPickerSingle, addButtonCallbackSpy, page } = setup({
          value: undefined,
          showAddButton: true,
          reUsePage: true
        });

        // Open the modal
        modalPickerSingle
          .find('ModalPickerOpener')
          .props()
          // @ts-expect-error Test mock
          .openModal();

        const { promise, resolve } = testUtils.resolvablePromise();
        addButtonCallbackSpy.mockReturnValueOnce(promise);

        modalPickerSingle
          .find('ModalPicker')
          .at(0)
          .props()
          // @ts-expect-error Test mock
          .addButton.onClick();

        // Expect the modal to be closed
        const modalPicker = modalPickerSingle.find('ModalPicker').props();
        // @ts-expect-error Test mock
        expect(modalPicker.isOpen).toBe(false);

        expect(addButtonCallbackSpy).toHaveBeenCalledTimes(1);

        const addedUser = randomUser();
        resolve(addedUser);

        try {
          await promise;

          testUtils.waitForUI(() => {
            const modalPicker = modalPickerSingle.find('ModalPicker').props();

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
            expect(modalPicker.selected).toEqual(addedUser);

            done();
          });
        } catch (error) {
          console.error(error);
          done.fail();
        }
      });

      it('should hide when the promise is rejected', async (done) => {
        expect.assertions(7);

        const { modalPickerSingle, addButtonCallbackSpy } = setup({
          value: undefined,
          showAddButton: true
        });

        // Open the modal
        modalPickerSingle
          .find('ModalPickerOpener')
          .props()
          // @ts-expect-error Test mock
          .openModal();

        const { promise, reject } = testUtils.rejectablePromise();
        addButtonCallbackSpy.mockReturnValueOnce(promise);

        modalPickerSingle
          .find('ModalPicker')
          .at(0)
          .props()
          // @ts-expect-error Test mock
          .addButton.onClick();

        // Expect the modal to be closed
        const modalPicker = modalPickerSingle.find('ModalPicker').props();
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
            const modalPicker = modalPickerSingle.find('ModalPicker').props();
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
      const value = adminUser();

      const { modalPickerSingle } = setup({ value });

      expect(modalPickerSingle.find('ModalPickerOpener').props().value).toEqual(
        value
      );

      modalPickerSingle.setProps({ value: undefined });

      expect(
        modalPickerSingle.find('ModalPickerOpener').props().value
      ).toBeUndefined();
    });

    test('becomes filled', () => {
      const { modalPickerSingle } = setup({
        value: undefined
      });

      expect(
        modalPickerSingle.find('ModalPickerOpener').props().value
      ).toBeUndefined();

      const value = adminUser();

      modalPickerSingle.setProps({
        value
      });

      expect(modalPickerSingle.find('ModalPickerOpener').props().value).toEqual(
        value
      );
    });
  });
});
