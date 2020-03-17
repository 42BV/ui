import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { emptyPage } from '@42.nl/spring-connect';

import ModalPickerMultiple, { State } from './ModalPickerMultiple';
import {
  adminUser,
  coordinatorUser,
  pageOfUsers,
  userUser
} from '../../../test/fixtures';

import { User } from '../../../test/types';
import * as testUtils from '../../../test/utils';
import { ListGroup, ListGroupItem } from 'reactstrap';
import * as optionTypesAndFunctions from '../../option';
import { RenderOptionsOption } from '../../option';
import { ButtonAlignment } from '../types';

describe('Component: ModalPickerMultiple', () => {
  let modalPickerMultiple: ShallowWrapper;

  let onChangeSpy: jest.Mock;
  let onBlurSpy: jest.Mock;
  let optionsSpy: jest.Mock;
  let addButtonCallbackSpy: jest.Mock;
  let renderOptionsSpy: jest.Mock;

  function setup({
    value,
    showAddButton,
    canSearch = undefined,
    hasLabel = true,
    spyOnRenderOptions,
    alignButton,
    hasDisplayValues = false,
    hasIsOptionEqual = false
  }: {
    value?: User[];
    showAddButton: boolean;
    canSearch?: boolean;
    hasLabel?: boolean;
    spyOnRenderOptions?: boolean;
    alignButton?: ButtonAlignment;
    hasDisplayValues?: boolean;
    hasIsOptionEqual?: boolean;
  }) {
    onChangeSpy = jest.fn();
    onBlurSpy = jest.fn();
    optionsSpy = jest.fn();
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
      canSearch,
      isOptionEqual: hasIsOptionEqual
        ? (a: User, b: User) => a.id === b.id
        : undefined,
      options: optionsSpy,
      optionForValue: (user: User) => user.email,
      renderOptions: renderOptionsSpy,
      addButton,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      alignButton,
      displayValues: hasDisplayValues
        ? (users?: User[]) => (
            <span>
              {users
                ? users.map((user) => user.id).join(', ')
                : 'none selected'}
            </span>
          )
        : undefined
    };

    if (hasLabel) {
      modalPickerMultiple = shallow(
        <ModalPickerMultiple
          id="bestFriend"
          label="Best Friend"
          color="success"
          {...props}
        />
      );
    } else {
      modalPickerMultiple = shallow(
        <ModalPickerMultiple color="success" {...props} />
      );
    }
  }

  describe('lifecycle events', () => {
    it('should load the first page on componentDidMount', () => {
      // @ts-expect-error Test mock
      const modalPickerMultiple = new ModalPickerMultiple();
      jest
        .spyOn(modalPickerMultiple, 'loadPage')
        .mockImplementation(() => Promise.resolve(undefined));
      modalPickerMultiple.componentDidMount();

      expect(modalPickerMultiple.loadPage).toHaveBeenCalledTimes(1);
      expect(modalPickerMultiple.loadPage).toHaveBeenCalledWith(1);
    });
  });

  describe('ui', () => {
    it('should render', () => {
      setup({
        value: [adminUser(), userUser()],
        showAddButton: false
      });

      expect(toJson(modalPickerMultiple)).toMatchSnapshot(
        'Component: ModalPickerMultiple => ui => should render'
      );
    });

    it('should not render search canSearch is false', () => {
      setup({
        value: [adminUser(), userUser()],
        showAddButton: false,
        canSearch: false
      });

      // @ts-expect-error Test mock
      expect(modalPickerMultiple.find('ModalPicker').props().canSearch).toBe(
        false
      );
    });

    it('should render multiple labels with the selected values when the value array is not empty', () => {
      setup({
        value: [adminUser(), userUser()],
        showAddButton: false
      });

      expect(
        modalPickerMultiple.find('ModalPickerOpener').props().values
      ).toEqual([adminUser(), userUser()]);
    });

    it('should render no labels when the value array is empty', () => {
      setup({ value: undefined, showAddButton: false });

      expect(
        modalPickerMultiple.find('ModalPickerOpener').props().values
      ).toBeUndefined();
    });

    it('should render multiple labels inside the modal with the selected values when the selected property is not empty', () => {
      setup({ value: undefined, showAddButton: false });
      modalPickerMultiple.setState({
        selected: [adminUser(), userUser()]
      });

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
      setup({ value: undefined, showAddButton: false });
      modalPickerMultiple.setState({ selected: undefined });

      expect(modalPickerMultiple.find('Tag').exists()).toBe(false);
    });

    it('should render EmptyState when the totalElements of the page are zero', () => {
      setup({ value: undefined, showAddButton: false });
      modalPickerMultiple.setState({
        page: emptyPage(),
        userHasSearched: true
      });

      const emptyModal = modalPickerMultiple.find('EmptyModal').at(0);
      // @ts-expect-error Test mock
      expect(emptyModal.props().userHasSearched).toBe(true);
    });

    it('should render the options with the correct checked state', () => {
      setup({ value: [adminUser(), coordinatorUser()], showAddButton: false });
      modalPickerMultiple.setState({
        page: pageOfUsers(),
        selected: [adminUser(), coordinatorUser()]
      });

      const admin = modalPickerMultiple.find('Input').at(0);
      const coordinator = modalPickerMultiple.find('Input').at(1);
      const user = modalPickerMultiple.find('Input').at(2);

      expect(admin.props().checked).toBe(true);
      expect(coordinator.props().checked).toBe(true);
      expect(user.props().checked).toBe(false);
    });

    it('should render properly without label', () => {
      setup({
        value: [adminUser(), userUser()],
        showAddButton: false,
        hasLabel: false
      });

      expect(toJson(modalPickerMultiple)).toMatchSnapshot(
        'Component: ModalPickerMultiple => ui => should render properly without label'
      );
    });

    it('should render button left', () => {
      setup({
        value: [adminUser()],
        showAddButton: false,
        alignButton: 'left'
      });
      expect(toJson(modalPickerMultiple)).toMatchSnapshot(
        'Component: ModalPickerMultiple => ui => should render button left'
      );
    });

    it('should render button right without value', () => {
      setup({ value: undefined, showAddButton: false, alignButton: 'right' });
      expect(toJson(modalPickerMultiple)).toMatchSnapshot(
        'Component: ModalPickerMultiple => ui => should render button right without value'
      );
    });

    it('should render button right with value', () => {
      setup({
        value: [adminUser()],
        showAddButton: false,
        alignButton: 'right'
      });
      expect(toJson(modalPickerMultiple)).toMatchSnapshot(
        'Component: ModalPickerMultiple => ui => should render button right with value'
      );
    });

    it('should use custom display function to render values', () => {
      setup({
        value: [adminUser()],
        showAddButton: false,
        hasDisplayValues: true
      });
      expect(toJson(modalPickerMultiple)).toMatchSnapshot(
        'Component: ModalPickerMultiple => ui => should use custom display function to render values'
      );
    });
  });

  describe('events', () => {
    describe('opening the modal', () => {
      it('should open the modal when the select button is clicked', async (done) => {
        expect.assertions(8);

        setup({
          value: [adminUser(), userUser()],
          showAddButton: false
        });

        const promise = Promise.resolve(pageOfUsers());
        optionsSpy.mockReturnValue(promise);

        modalPickerMultiple
          .find('ModalPickerOpener')
          .props()
          // @ts-expect-error Test mock
          .openModal();
        expect(optionsSpy).toHaveBeenCalledTimes(1);
        expect(optionsSpy).toHaveBeenCalledWith('', 1, 10);

        try {
          await promise;

          const state = modalPickerMultiple.state() as State<User>;

          expect(state.selected).toEqual([adminUser(), userUser()]);
          expect(state.isOpen).toBe(true);
          expect(state.query).toBe('');

          expect(state.userHasSearched).toBe(false);
          expect(state.page).toEqual(pageOfUsers());

          // @ts-expect-error Test mock
          const value = modalPickerMultiple.instance().props.value;
          expect(state.selected).not.toBe(value);

          done();
        } catch (error) {
          console.error(error);
          done.fail();
        }
      });

      it('should set selected as empty array if no values are present', async (done) => {
        expect.assertions(3);

        setup({
          value: undefined,
          showAddButton: false
        });

        const promise = Promise.resolve(pageOfUsers());
        optionsSpy.mockReturnValue(promise);

        modalPickerMultiple
          .find('ModalPickerOpener')
          .props()
          // @ts-expect-error Test mock
          .openModal();

        expect(optionsSpy).toHaveBeenCalledTimes(1);
        expect(optionsSpy).toHaveBeenCalledWith('', 1, 10);

        try {
          await promise;

          const state = modalPickerMultiple.state() as State<User>;

          expect(state.selected).toEqual([]);

          done();
        } catch (error) {
          console.error(error);
          done.fail();
        }
      });
    });

    it('should fetch options when the user searches', () => {
      setup({
        value: undefined,
        showAddButton: false
      });

      const promise = Promise.resolve(pageOfUsers());
      optionsSpy.mockReturnValue(promise);

      const modalPicker = modalPickerMultiple.find('ModalPicker').at(0);
      // @ts-expect-error Test mock
      modalPicker.props().options('tes');

      expect(optionsSpy).toHaveBeenCalledTimes(1);
      expect(optionsSpy).toHaveBeenCalledWith('tes', 1, 10);
    });

    it('should when the user moves to another page load the new page', async (done) => {
      expect.assertions(5);

      setup({ value: undefined, showAddButton: false });
      modalPickerMultiple.setState({ query: 'search' });

      const promise = Promise.resolve(pageOfUsers());
      optionsSpy.mockReturnValue(promise);

      const modalPicker = modalPickerMultiple.find('ModalPicker').at(0);
      // @ts-expect-error Test mock
      modalPicker.props().pageChanged(42);

      expect(optionsSpy).toHaveBeenCalledTimes(1);
      expect(optionsSpy).toHaveBeenCalledWith('search', 42, 10);

      try {
        await promise;

        const state = modalPickerMultiple.state() as State<User>;

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
      modalPickerMultiple.setState({ isOpen: true });

      modalPickerMultiple
        .find('ModalPicker')
        .at(0)
        .props()
        // @ts-expect-error Test mock
        .closeModal();

      // @ts-expect-error Test mock
      expect(modalPickerMultiple.state().isOpen).toBe(false);
    });

    it('should when the user clicks save, it should close the modal and select the value', () => {
      const value = [adminUser(), userUser()];
      setup({ value, showAddButton: false });

      modalPickerMultiple.setState({ isOpen: true });
      modalPickerMultiple.setState({ selected: value });

      modalPickerMultiple
        .find('ModalPicker')
        .at(0)
        .props()
        // @ts-expect-error Test mock
        .modalSaved();

      // @ts-expect-error Test mock
      expect(modalPickerMultiple.state().isOpen).toBe(false);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith([adminUser(), userUser()]);
    });

    describe('onChange', () => {
      it('should when the user clicks the clear button clear the value', () => {
        const value = [adminUser(), userUser()];
        setup({ value, showAddButton: false });

        modalPickerMultiple.setState({ isOpen: true });
        modalPickerMultiple.setState({ selected: value });

        modalPickerMultiple
          .find('ModalPickerOpener')
          .props()
          // @ts-expect-error Test mock
          .onClear();

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(undefined);
      });

      describe('isOptionEqual', () => {
        it('should when there is no isOptionEqual fall back to simple equality check', () => {
          const admin = adminUser();
          // @ts-expect-error Test mock
          admin.x = Math.random();
          const coordinator = coordinatorUser();
          const user = userUser();

          setup({
            value: [admin, coordinator],
            showAddButton: false,
            hasIsOptionEqual: false
          });
          modalPickerMultiple.setState({
            page: testUtils.pageWithContent([admin, coordinator, user]),
            selected: [admin, coordinator]
          });

          // admin, and coordinator should be selected
          // @ts-expect-error Test mock
          expect(modalPickerMultiple.state().selected).toEqual([
            admin,
            coordinator
          ]);

          // Click on admin, he should be removed
          // @ts-expect-error Test mock
          modalPickerMultiple
            .find('Input')
            .at(0)
            .props()
            // @ts-expect-error Test mock
            .onChange();
          modalPickerMultiple.update();
          // @ts-expect-error Test mock
          expect(modalPickerMultiple.state().selected).toEqual([coordinator]);

          // Click on admin again, he should be added
          // @ts-expect-error Test mock
          modalPickerMultiple
            .find('Input')
            .at(0)
            .props()
            // @ts-expect-error Test mock
            .onChange();
          modalPickerMultiple.update();
          // @ts-expect-error Test mock
          expect(modalPickerMultiple.state().selected).toEqual([
            coordinator,
            admin
          ]);

          // Click on coordinator, he should be removed
          // @ts-expect-error Test mock
          modalPickerMultiple
            .find('Input')
            .at(1)
            .props()
            // @ts-expect-error Test mock
            .onChange();

          modalPickerMultiple.update();

          // @ts-expect-error Test mock
          expect(modalPickerMultiple.state().selected).toEqual([admin]);

          // Click on user again, he should be added
          // @ts-expect-error Test mock
          modalPickerMultiple
            .find('Input')
            .at(1)
            .props()
            // @ts-expect-error Test mock
            .onChange();

          modalPickerMultiple.update();

          // @ts-expect-error Test mock
          expect(modalPickerMultiple.state().selected).toEqual([
            admin,
            coordinator
          ]);

          // Click on user, he should be added
          // @ts-expect-error Test mock
          modalPickerMultiple
            .find('Input')
            .at(2)
            .props()
            // @ts-expect-error Test mock
            .onChange();
          modalPickerMultiple.update();
          // @ts-expect-error Test mock
          expect(modalPickerMultiple.state().selected).toEqual([
            admin,
            coordinator,
            user
          ]);

          // Click on user again, he should be removed
          // @ts-expect-error Test mock
          modalPickerMultiple
            .find('Input')
            .at(2)
            .props()
            // @ts-expect-error Test mock
            .onChange();
          modalPickerMultiple.update();
          // @ts-expect-error Test mock
          expect(modalPickerMultiple.state().selected).toEqual([
            admin,
            coordinator
          ]);
        });

        it('should when there is a custom isOptionEqual use that for the equality check', () => {
          setup({
            value: [adminUser(), coordinatorUser()],
            showAddButton: false,
            hasIsOptionEqual: true
          });
          modalPickerMultiple.setState({
            page: pageOfUsers(),
            selected: [adminUser(), coordinatorUser()]
          });

          // admin, and coordinator should be selected
          // @ts-expect-error Test mock
          expect(modalPickerMultiple.state().selected).toEqual([
            adminUser(),
            coordinatorUser()
          ]);

          // Click on admin, he should be removed
          // @ts-expect-error Test mock
          modalPickerMultiple
            .find('Input')
            .at(0)
            .props()
            // @ts-expect-error Test mock
            .onChange();
          modalPickerMultiple.update();
          // @ts-expect-error Test mock
          expect(modalPickerMultiple.state().selected).toEqual([
            coordinatorUser()
          ]);

          // Click on admin again, he should be added
          // @ts-expect-error Test mock
          modalPickerMultiple
            .find('Input')
            .at(0)
            .props()
            // @ts-expect-error Test mock
            .onChange();
          modalPickerMultiple.update();
          // @ts-expect-error Test mock
          expect(modalPickerMultiple.state().selected).toEqual([
            coordinatorUser(),
            adminUser()
          ]);

          // Click on coordinator, he should be removed
          // @ts-expect-error Test mock
          modalPickerMultiple
            .find('Input')
            .at(1)
            .props()
            // @ts-expect-error Test mock
            .onChange();

          modalPickerMultiple.update();

          // @ts-expect-error Test mock
          expect(modalPickerMultiple.state().selected).toEqual([adminUser()]);

          // Click on user again, he should be added
          // @ts-expect-error Test mock
          modalPickerMultiple
            .find('Input')
            .at(1)
            .props()
            // @ts-expect-error Test mock
            .onChange();

          modalPickerMultiple.update();

          // @ts-expect-error Test mock
          expect(modalPickerMultiple.state().selected).toEqual([
            adminUser(),
            coordinatorUser()
          ]);

          // Click on user, he should be added
          // @ts-expect-error Test mock
          modalPickerMultiple
            .find('Input')
            .at(2)
            .props()
            // @ts-expect-error Test mock
            .onChange();
          modalPickerMultiple.update();
          // @ts-expect-error Test mock
          expect(modalPickerMultiple.state().selected).toEqual([
            adminUser(),
            coordinatorUser(),
            userUser()
          ]);

          // Click on user again, he should be removed
          // @ts-expect-error Test mock
          modalPickerMultiple
            .find('Input')
            .at(2)
            .props()
            // @ts-expect-error Test mock
            .onChange();
          modalPickerMultiple.update();
          // @ts-expect-error Test mock
          expect(modalPickerMultiple.state().selected).toEqual([
            adminUser(),
            coordinatorUser()
          ]);
        });
      });

      it('should when the user removes a label inside the modal the label should be removed', () => {
        setup({ value: [adminUser(), userUser()], showAddButton: false });

        modalPickerMultiple.setState({
          page: pageOfUsers(),
          selected: [adminUser(), userUser()]
        });

        const adminTag = modalPickerMultiple.find('Tag').at(0);
        const userTag = modalPickerMultiple.find('Tag').at(1);

        // @ts-expect-error Test mock
        adminTag.props().onRemove(adminUser(), true);
        // @ts-expect-error Test mock
        expect(modalPickerMultiple.state().selected).toEqual([userUser()]);

        // @ts-expect-error Test mock
        userTag.props().onRemove(userUser(), true);
        // @ts-expect-error Test mock
        expect(modalPickerMultiple.state().selected).toEqual([]);
      });
    });

    describe('addButton', () => {
      it('should add an item on the first position, when the promise resolves', async (done) => {
        expect.assertions(6);

        setup({
          value: [adminUser()],
          showAddButton: true
        });
        modalPickerMultiple.setState({
          isOpen: true,
          page: testUtils.pageWithContent([adminUser()])
        });

        const { promise, resolve } = testUtils.resolvablePromise();
        addButtonCallbackSpy.mockReturnValueOnce(promise);

        // @ts-expect-error Test mock
        jest.spyOn(modalPickerMultiple.instance(), 'itemClicked');

        modalPickerMultiple
          .find('ModalPicker')
          .at(0)
          .props()
          // @ts-expect-error Test mock
          .addButton.onClick();

        // @ts-expect-error Test mock
        expect(modalPickerMultiple.state().isOpen).toBe(false);
        expect(addButtonCallbackSpy).toHaveBeenCalledTimes(1);

        resolve(coordinatorUser());

        try {
          await promise;

          testUtils.waitForUI(() => {
            const state = modalPickerMultiple.state() as State<User>;

            expect(
              // @ts-expect-error Test mock
              modalPickerMultiple.instance().itemClicked
            ).toHaveBeenCalledTimes(1);
            expect(
              // @ts-expect-error Test mock
              modalPickerMultiple.instance().itemClicked
            ).toHaveBeenCalledWith(coordinatorUser(), true);

            expect(state.page.content).toEqual([
              coordinatorUser(),
              adminUser()
            ]);

            expect(state.isOpen).toBe(true);

            done();
          });
        } catch (error) {
          console.error(error);
          done.fail();
        }
      });

      it('should hide when the promise is rejected', async (done) => {
        expect.assertions(3);

        setup({
          value: [adminUser()],
          showAddButton: true
        });
        modalPickerMultiple.setState({ isOpen: true });

        const { promise, reject } = testUtils.rejectablePromise();
        addButtonCallbackSpy.mockReturnValueOnce(promise);

        modalPickerMultiple
          .find('ModalPicker')
          .at(0)
          .props()
          // @ts-expect-error Test mock
          .addButton.onClick();

        // @ts-expect-error Test mock
        expect(modalPickerMultiple.state().isOpen).toBe(false);
        expect(addButtonCallbackSpy).toHaveBeenCalledTimes(1);

        reject();

        try {
          await promise;
          done.fail();
        } catch (error) {
          testUtils.waitForUI(() => {
            // @ts-expect-error Test mock
            expect(modalPickerMultiple.state().isOpen).toBe(true);

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

        modalPickerMultiple.setState({
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

        modalPickerMultiple.setState({
          isOpen: true,
          page: pageOfUsers()
        });

        // @ts-expect-error Test mock
        modalPickerMultiple
          .find('ListGroupItem')
          .at(0)
          .props()
          // @ts-expect-error Test mock
          .onClick();
        modalPickerMultiple.update();

        // @ts-expect-error Test mock
        expect(modalPickerMultiple.state().selected).toEqual([
          pageOfUsers().content[0]
        ]);
      });
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      const value = [adminUser()];

      setup({ value: value, showAddButton: false });

      expect(
        modalPickerMultiple.find('ModalPickerOpener').props().values
      ).toEqual(value);

      modalPickerMultiple.setProps({ value: undefined });

      expect(
        modalPickerMultiple.find('ModalPickerOpener').props().values
      ).toBeUndefined();
    });

    test('becomes filled', () => {
      setup({ value: undefined, showAddButton: false });

      expect(
        modalPickerMultiple.find('ModalPickerOpener').props().values
      ).toBeUndefined();

      modalPickerMultiple.setProps({
        value: [adminUser()]
      });

      expect(
        modalPickerMultiple.find('ModalPickerOpener').props().values
      ).toEqual([adminUser()]);
    });
  });
});
