import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { emptyPage } from '@42.nl/spring-connect';

import ModalPickerSingle, { State } from './ModalPickerSingle';
import { User } from '../../../test/types';
import * as testUtils from '../../../test/utils';
import {
  pageOfUsers,
  adminUser,
  userUser,
  coordinatorUser
} from '../../../test/fixtures';

describe('Component: ModalPickerSingle', () => {
  let modalPickerSingle: ShallowWrapper;

  let onChangeSpy: jest.Mock<any, any>;
  let onBlurSpy: jest.Mock<any, any>;
  let fetchOptionsSpy: jest.Mock<any, any>;
  let addButtonCallbackSpy: jest.Mock<any, any>;

  function setup({
    value,
    showAddButton,
    canSearch = undefined,
    label = 'Best Friend'
  }: {
    value?: User;
    showAddButton: boolean;
    canSearch?: boolean;
    label?: string | null;
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();
    fetchOptionsSpy = jest.fn();
    addButtonCallbackSpy = jest.fn();

    const addButton = showAddButton
      ? { label: 'Add color', onClick: addButtonCallbackSpy }
      : undefined;

    const props = {
      id: 'bestFriend',
      name: 'bestFriend',
      label,
      placeholder: 'Select your best friend',
      optionForValue: (user: User) => user.email,
      canSearch,
      fetchOptions: fetchOptionsSpy,
      addButton,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      color: 'success'
    };

    // @ts-ignore
    modalPickerSingle = shallow(<ModalPickerSingle {...props} />);
  }

  describe('lifecycle events', () => {
    it('should load the first page on componentDidMount', () => {
      // @ts-ignore
      const modalPickerSingle = new ModalPickerSingle();
      jest
        .spyOn(modalPickerSingle, 'loadPage')
        .mockImplementation(() => undefined);
      modalPickerSingle.componentDidMount();

      expect(modalPickerSingle.loadPage).toHaveBeenCalledTimes(1);
      expect(modalPickerSingle.loadPage).toHaveBeenCalledWith(1);
    });
  });

  describe('ui', () => {
    it('should render', () => {
      setup({ value: adminUser, showAddButton: false });
      expect(toJson(modalPickerSingle)).toMatchSnapshot(
        'Component: ModalPickerSingle => ui => should render'
      );
    });

    it('should not render search canSearch is false', () => {
      setup({
        value: adminUser,
        showAddButton: false,
        canSearch: false
      });

      // @ts-ignore
      expect(modalPickerSingle.find('ModalPicker').props().canSearch).toBe(
        false
      );
    });

    it('should render a label with the selected value when the value is not empty', () => {
      setup({ value: adminUser, showAddButton: false });
      expect(modalPickerSingle.find('span').text()).toBe('admin@42.nl');
    });

    it('should not render a label when the value is empty', () => {
      setup({ value: undefined, showAddButton: false });
      expect(modalPickerSingle.find('span').exists()).toBe(false);
    });

    it('should render EmptyState when the totalElements of the page are zero', () => {
      setup({ value: undefined, showAddButton: false });
      modalPickerSingle.setState({ page: emptyPage(), userHasSearched: true });

      const emptyModal = modalPickerSingle.find('EmptyModal').at(0);
      // @ts-ignore
      expect(emptyModal.props().userHasSearched).toBe(true);
    });

    it('should render the options with the correct checked state', () => {
      setup({ value: adminUser, showAddButton: false });

      modalPickerSingle.setState({
        page: pageOfUsers,
        selected: { ...adminUser }
      });

      const admin = modalPickerSingle.find('Input').at(0);
      const coordinator = modalPickerSingle.find('Input').at(1);
      const user = modalPickerSingle.find('Input').at(2);

      expect(admin.props().checked).toBe(true);
      expect(coordinator.props().checked).toBe(false);
      expect(user.props().checked).toBe(false);
    });

    it('should render without label', () => {
      setup({ value: adminUser, showAddButton: false, label: null });
      expect(toJson(modalPickerSingle)).toMatchSnapshot(
        'Component: ModalPickerSingle => ui => should render without label'
      );
    });
  });

  describe('events', () => {
    it('should open the modal when the select button is clicked', async done => {
      setup({
        value: adminUser,
        showAddButton: false
      });

      const promise = Promise.resolve(pageOfUsers);
      fetchOptionsSpy.mockReturnValue(promise);

      // @ts-ignore
      modalPickerSingle
        .find('Button')
        .props()
        // @ts-ignore
        .onClick();

      expect(fetchOptionsSpy).toHaveBeenCalledTimes(1);
      expect(fetchOptionsSpy).toHaveBeenCalledWith('', 1, 10);

      try {
        await promise;

        const state = modalPickerSingle.state() as State<User>;

        expect(state.selected).toEqual(adminUser);
        expect(state.isOpen).toBe(true);
        expect(state.query).toBe('');

        expect(state.userHasSearched).toBe(false);
        expect(state.page).toBe(pageOfUsers);

        done();
      } catch (error) {
        console.error(error);
        done.fail();
      }
    });

    it('should fetch options when the user searches', () => {
      setup({
        value: undefined,
        showAddButton: false
      });

      const promise = Promise.resolve(pageOfUsers);
      fetchOptionsSpy.mockReturnValue(promise);

      const modalPicker = modalPickerSingle.find('ModalPicker').at(0);
      // @ts-ignore
      modalPicker.props().fetchOptions('tes');

      expect(fetchOptionsSpy).toHaveBeenCalledTimes(1);
      expect(fetchOptionsSpy).toHaveBeenCalledWith('tes', 1, 10);
    });

    it('should when the user moves to another page load the new page', async done => {
      setup({ value: undefined, showAddButton: false });
      modalPickerSingle.setState({ query: 'search' });

      const promise = Promise.resolve(pageOfUsers);
      fetchOptionsSpy.mockReturnValue(promise);

      const modalPicker = modalPickerSingle.find('ModalPicker').at(0);
      // @ts-ignore
      modalPicker.props().pageChanged(42);

      expect(fetchOptionsSpy).toHaveBeenCalledTimes(1);
      expect(fetchOptionsSpy).toHaveBeenCalledWith('search', 42, 10);

      try {
        await promise;

        const state = modalPickerSingle.state() as State<User>;

        expect(state.userHasSearched).toBe(true);
        expect(state.page).toBe(pageOfUsers);

        expect(state.query).toBe('search');
        done();
      } catch (error) {
        console.error(error);
        done.fail();
      }
    });

    it('should when the user closes the modal the modal should close', () => {
      setup({ value: undefined, showAddButton: false });
      modalPickerSingle.setState({ isOpen: true });

      // @ts-ignore
      modalPickerSingle
        .find('ModalPicker')
        .at(0)
        .props()
        // @ts-ignore
        .closeModal();

      // @ts-ignore
      expect(modalPickerSingle.state().isOpen).toBe(false);
    });

    it('should when the user clicks save it should close the modal and select the value', () => {
      setup({ value: adminUser, showAddButton: false });

      modalPickerSingle.setState({ isOpen: true });
      modalPickerSingle.setState({ selected: adminUser });

      modalPickerSingle
        .find('ModalPicker')
        .at(0)
        .props()
        // @ts-ignore
        .modalSaved();

      // @ts-ignore;
      expect(modalPickerSingle.state().isOpen).toBe(false);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(adminUser);
    });

    it('should when the user selects an option store the value', () => {
      setup({ value: adminUser, showAddButton: false });
      modalPickerSingle.setState({
        page: pageOfUsers,
        selected: adminUser
      });

      // @ts-ignore
      modalPickerSingle
        .find('Input')
        .at(1)
        .props()
        // @ts-ignore
        .onChange();

      // @ts-ignore
      expect(modalPickerSingle.state().selected).toEqual(coordinatorUser);

      // @ts-ignore
      modalPickerSingle
        .find('Input')
        .at(2)
        .props()
        // @ts-ignore
        .onChange();

      // @ts-ignore
      expect(modalPickerSingle.state().selected).toEqual(userUser);

      // @ts-ignore
      modalPickerSingle
        .find('Input')
        .at(0)
        .props()
        // @ts-ignore
        .onChange();

      // @ts-ignore
      expect(modalPickerSingle.state().selected).toEqual(adminUser);
    });

    describe('addButton', () => {
      it('should add an item on the first position, when the promise resolves', async done => {
        setup({
          value: adminUser,
          showAddButton: true
        });
        modalPickerSingle.setState({
          isOpen: true,
          page: testUtils.pageWithContent([adminUser])
        });

        const { promise, resolve } = testUtils.resolvablePromise();
        addButtonCallbackSpy.mockReturnValueOnce(promise);

        // @ts-ignore
        jest.spyOn(modalPickerSingle.instance(), 'itemClicked');

        modalPickerSingle
          .find('ModalPicker')
          .at(0)
          .props()
          // @ts-ignore
          .addButton.onClick();

        // @ts-ignore
        expect(modalPickerSingle.state().isOpen).toBe(false);
        expect(addButtonCallbackSpy).toHaveBeenCalledTimes(1);

        resolve(userUser);

        try {
          await promise;

          testUtils.waitForUI(() => {
            const state = modalPickerSingle.state() as State<User>;

            expect(
              // @ts-ignore
              modalPickerSingle.instance().itemClicked
            ).toHaveBeenCalledTimes(1);
            expect(
              // @ts-ignore
              modalPickerSingle.instance().itemClicked
            ).toHaveBeenCalledWith(userUser);

            expect(state.page.content).toEqual([userUser, adminUser]);

            expect(state.isOpen).toBe(true);

            done();
          });
        } catch (error) {
          console.error(error);
          done.fail();
        }
      });

      it('should hide when the promise is rejected', async done => {
        setup({
          value: undefined,
          showAddButton: true
        });
        modalPickerSingle.setState({ isOpen: true });

        const { promise, reject } = testUtils.rejectablePromise();
        addButtonCallbackSpy.mockReturnValueOnce(promise);

        modalPickerSingle
          .find('ModalPicker')
          .at(0)
          .props()
          // @ts-ignore
          .addButton.onClick();

        // @ts-ignore
        expect(modalPickerSingle.state().isOpen).toBe(false);
        expect(addButtonCallbackSpy).toHaveBeenCalledTimes(1);

        reject();

        try {
          await promise;
          done.fail();
        } catch (error) {
          testUtils.waitForUI(() => {
            // @ts-ignore
            expect(modalPickerSingle.state().isOpen).toBe(true);

            done();
          });
        }
      });
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      setup({ value: adminUser, showAddButton: false });

      const value = modalPickerSingle.find('span').text();
      expect(value).toBe('admin@42.nl');

      modalPickerSingle.setProps({ value: undefined });

      expect(modalPickerSingle.find('span').exists()).toBe(false);
    });

    test('becomes filled', () => {
      setup({ value: undefined, showAddButton: false });

      expect(modalPickerSingle.find('span').exists()).toBe(false);

      modalPickerSingle.setProps({
        value: adminUser
      });

      const value = modalPickerSingle.find('span').text();
      expect(value).toBe('admin@42.nl');
    });
  });
});
