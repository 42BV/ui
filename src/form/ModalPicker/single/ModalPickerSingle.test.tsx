import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { emptyPage } from '@42.nl/spring-connect';

import ModalPickerSingle, { State } from './ModalPickerSingle';
import { User } from '../../../test/types';
import * as testUtils from '../../../test/utils';
import {
  adminUser,
  coordinatorUser,
  pageOfUsers,
  userUser
} from '../../../test/fixtures';
import { ListGroup, ListGroupItem } from 'reactstrap';
import * as optionTypesAndFunctions from '../../option';
import { RenderOptionsOption } from '../../option';
import { ButtonAlignment } from '../types';

describe('Component: ModalPickerSingle', () => {
  let modalPickerSingle: ShallowWrapper;

  let onChangeSpy: jest.Mock;
  let onBlurSpy: jest.Mock;
  let fetchOptionsSpy: jest.Mock;
  let addButtonCallbackSpy: jest.Mock;
  let renderOptionsSpy: jest.Mock;

  function setup({
    value,
    showAddButton,
    canSearch = undefined,
    hasLabel = true,
    spyOnRenderOptions,
    alignButton,
    hasDisplayValues = false
  }: {
    value?: User;
    showAddButton: boolean;
    canSearch?: boolean;
    hasLabel?: boolean;
    spyOnRenderOptions?: boolean;
    alignButton?: ButtonAlignment;
    hasDisplayValues?: boolean;
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();
    fetchOptionsSpy = jest.fn();
    addButtonCallbackSpy = jest.fn();

    if (spyOnRenderOptions) {
      renderOptionsSpy = jest.fn((options: RenderOptionsOption<User>[]) => {
        return (
          <ListGroup>
            {options.map((option: RenderOptionsOption<User>) => (
              <ListGroupItem key={option.option.id} onClick={option.toggle}>
                {option.option.email}
              </ListGroupItem>
            ))}
          </ListGroup>
        );
      });
    }

    const addButton = showAddButton
      ? { label: 'Add color', onClick: addButtonCallbackSpy }
      : undefined;

    const props = {
      name: 'bestFriend',
      placeholder: 'Select your best friend',
      optionForValue: (user: User) => user.email,
      renderOptions: renderOptionsSpy,
      canSearch,
      fetchOptions: fetchOptionsSpy,
      addButton,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      alignButton,
      displayValues: hasDisplayValues
        ? (user?: User) => <span>{user ? user.id : 'none selected'}</span>
        : undefined
    };

    if (hasLabel) {
      modalPickerSingle = shallow<ModalPickerSingle<User>>(
        <ModalPickerSingle
          id="bestFriend"
          label="Best Friend"
          color="success"
          {...props}
        />
      );
    } else {
      modalPickerSingle = shallow<ModalPickerSingle<User>>(
        <ModalPickerSingle color="success" {...props} />
      );
    }
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
      setup({ value: adminUser(), showAddButton: false });
      expect(toJson(modalPickerSingle)).toMatchSnapshot(
        'Component: ModalPickerSingle => ui => should render'
      );
    });

    it('should not render search canSearch is false', () => {
      setup({
        value: adminUser(),
        showAddButton: false,
        canSearch: false
      });

      // @ts-ignore
      expect(modalPickerSingle.find('ModalPicker').props().canSearch).toBe(
        false
      );
    });

    it('should render a label with the selected value when the value is not empty', () => {
      const value = adminUser();
      setup({ value, showAddButton: false });
      expect(
        modalPickerSingle.find('ModalPickerOpener').props().values
      ).toEqual(value);
    });

    it('should not render a label when the value is empty', () => {
      setup({ value: undefined, showAddButton: false });
      expect(
        // @ts-ignore
        modalPickerSingle.find('ModalPickerOpener').props.values
      ).toBeUndefined();
    });

    it('should render EmptyState when the totalElements of the page are zero', () => {
      setup({ value: undefined, showAddButton: false });
      modalPickerSingle.setState({ page: emptyPage(), userHasSearched: true });

      const emptyModal = modalPickerSingle.find('EmptyModal').at(0);
      // @ts-ignore
      expect(emptyModal.props().userHasSearched).toBe(true);
    });

    it('should render the options with the correct checked state', () => {
      setup({ value: adminUser(), showAddButton: false });

      modalPickerSingle.setState({
        page: pageOfUsers(),
        selected: { ...adminUser() }
      });

      const admin = modalPickerSingle.find('Input').at(0);
      const coordinator = modalPickerSingle.find('Input').at(1);
      const user = modalPickerSingle.find('Input').at(2);

      expect(admin.props().checked).toBe(true);
      expect(coordinator.props().checked).toBe(false);
      expect(user.props().checked).toBe(false);
    });

    it('should render without label', () => {
      setup({ value: adminUser(), showAddButton: false, hasLabel: false });
      expect(toJson(modalPickerSingle)).toMatchSnapshot(
        'Component: ModalPickerSingle => ui => should render without label'
      );
    });

    it('should render button left', () => {
      setup({ value: adminUser(), showAddButton: false, alignButton: 'left' });
      expect(toJson(modalPickerSingle)).toMatchSnapshot(
        'Component: ModalPickerSingle => ui => should render button left'
      );
    });

    it('should render button right without value', () => {
      setup({ value: undefined, showAddButton: false, alignButton: 'right' });
      expect(toJson(modalPickerSingle)).toMatchSnapshot(
        'Component: ModalPickerSingle => ui => should render button right without value'
      );
    });

    it('should render button right with value', () => {
      setup({ value: adminUser(), showAddButton: false, alignButton: 'right' });
      expect(toJson(modalPickerSingle)).toMatchSnapshot(
        'Component: ModalPickerSingle => ui => should render button right with value'
      );
    });

    it('should use custom display function to render values', () => {
      setup({
        value: adminUser(),
        showAddButton: false,
        hasDisplayValues: true
      });
      expect(toJson(modalPickerSingle)).toMatchSnapshot(
        'Component: ModalPickerSingle => ui => should use custom display function to render values'
      );
    });
  });

  describe('events', () => {
    it('should open the modal when the select button is clicked', async done => {
      const value = adminUser();

      setup({
        value,
        showAddButton: false
      });

      const promise = Promise.resolve(pageOfUsers());
      fetchOptionsSpy.mockReturnValue(promise);

      modalPickerSingle
        .find('ModalPickerOpener')
        .props()
        // @ts-ignore
        .openModal();

      expect(fetchOptionsSpy).toHaveBeenCalledTimes(1);
      expect(fetchOptionsSpy).toHaveBeenCalledWith('', 1, 10);

      try {
        await promise;

        const state = modalPickerSingle.state() as State<User>;

        expect(state.selected).toEqual(value);
        expect(state.isOpen).toBe(true);
        expect(state.query).toBe('');

        expect(state.userHasSearched).toBe(false);
        expect(state.page).toEqual(pageOfUsers());

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

      const promise = Promise.resolve(pageOfUsers());
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

      const promise = Promise.resolve(pageOfUsers());
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
        expect(state.page).toEqual(pageOfUsers());

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
      setup({ value: adminUser(), showAddButton: false });

      modalPickerSingle.setState({ isOpen: true });
      modalPickerSingle.setState({ selected: adminUser });

      modalPickerSingle
        .find('ModalPicker')
        .at(0)
        .props()
        // @ts-ignore
        .modalSaved();

      // @ts-ignore
      expect(modalPickerSingle.state().isOpen).toBe(false);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(adminUser);
    });

    it('should when the user clicks the clear button clear the value', () => {
      const value = adminUser();
      setup({ value, showAddButton: false });

      modalPickerSingle.setState({ isOpen: true });
      modalPickerSingle.setState({ selected: value });

      // @ts-ignore
      modalPickerSingle
        .find('ModalPickerOpener')
        .props()
        // @ts-ignore
        .onClear();

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(undefined);
    });

    it('should when the user selects an option store the value', () => {
      setup({ value: adminUser(), showAddButton: false });
      modalPickerSingle.setState({
        page: pageOfUsers(),
        selected: adminUser()
      });

      // @ts-ignore
      modalPickerSingle
        .find('Input')
        .at(1)
        .props()
        // @ts-ignore
        .onChange();

      // @ts-ignore
      expect(modalPickerSingle.state().selected).toEqual(coordinatorUser());

      // @ts-ignore
      modalPickerSingle
        .find('Input')
        .at(2)
        .props()
        // @ts-ignore
        .onChange();

      // @ts-ignore
      expect(modalPickerSingle.state().selected).toEqual(userUser());

      // @ts-ignore
      modalPickerSingle
        .find('Input')
        .at(0)
        .props()
        // @ts-ignore
        .onChange();

      // @ts-ignore
      expect(modalPickerSingle.state().selected).toEqual(adminUser());
    });

    describe('addButton', () => {
      it('should add an item on the first position, when the promise resolves', async done => {
        setup({
          value: adminUser(),
          showAddButton: true
        });
        modalPickerSingle.setState({
          isOpen: true,
          page: testUtils.pageWithContent([adminUser()])
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

        resolve(userUser());

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
            ).toHaveBeenCalledWith(userUser());

            expect(state.page.content).toEqual([userUser(), adminUser()]);

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

    describe('renderOptions', () => {
      it('should when renderOptions is provided use that callback to render options', () => {
        const isOptionSelectedSpy = jest
          .spyOn(optionTypesAndFunctions, 'isOptionSelected')
          .mockReturnValue(false);

        setup({ showAddButton: false, spyOnRenderOptions: true });

        modalPickerSingle.setState({
          isOpen: true,
          page: pageOfUsers()
        });

        expect(renderOptionsSpy).toHaveBeenCalledTimes(1);
        expect(isOptionSelectedSpy).toHaveBeenCalledTimes(
          pageOfUsers().content.length
        );
      });

      it('should when renderOptions is provided call itemClicked on the option that is selected', () => {
        setup({ showAddButton: false, spyOnRenderOptions: true });

        modalPickerSingle.setState({
          isOpen: true,
          page: pageOfUsers()
        });

        // @ts-ignore
        modalPickerSingle
          .find('ListGroupItem')
          .at(0)
          .props()
          // @ts-ignore
          .onClick();
        modalPickerSingle.update();

        // @ts-ignore
        expect(modalPickerSingle.state().selected).toEqual(
          pageOfUsers().content[0]
        );
      });
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      const value = adminUser();

      setup({ value, showAddButton: false });

      expect(
        modalPickerSingle.find('ModalPickerOpener').props().values
      ).toEqual(value);

      modalPickerSingle.setProps({ value: undefined });

      expect(
        modalPickerSingle.find('ModalPickerOpener').props().values
      ).toBeUndefined();
    });

    test('becomes filled', () => {
      setup({ value: undefined, showAddButton: false });

      expect(
        modalPickerSingle.find('ModalPickerOpener').props().values
      ).toBeUndefined();

      const value = adminUser();

      modalPickerSingle.setProps({
        value
      });

      expect(
        modalPickerSingle.find('ModalPickerOpener').props().values
      ).toEqual(value);
    });
  });
});
