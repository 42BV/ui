import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { emptyPage, Page } from '@42.nl/spring-connect';

import ModalPicker, { RenderOptionsConfig } from './ModalPicker';
import { ContentState } from '../..';
import EmptyModal from './EmptyModal';
import { User } from '../../test/types';
import { adminUser, coordinatorUser, pageOfUsers } from '../../test/fixtures';
import { RenderOptionsOption } from './types';
import { ListGroup, ListGroupItem } from 'reactstrap';

describe('Component: ModalPicker', () => {
  function setup({
    showAddButton = false,
    canSearch = true,
    page = pageOfUsers(),
    loading = false,
    renderOptionsConfig,
    canSearchSync = true
  }: {
    page?: Page<User>;
    showAddButton?: boolean;
    canSearch?: boolean;
    loading?: boolean;
    renderOptionsConfig?: RenderOptionsConfig<User>;
    canSearchSync?: boolean;
  }) {
    const queryChangedSpy = jest.fn();
    const loadPageSpy = jest.fn();
    const closeModalSpy = jest.fn();
    const modalSavedSpy = jest.fn();
    const addButtonSpy = jest.fn();

    const addButton = showAddButton
      ? { label: 'Add color', onClick: addButtonSpy }
      : undefined;

    const modalPicker = shallow(
      <ModalPicker
        placeholder="Please select your favorite color"
        isOpen={true}
        page={page}
        queryChanged={queryChangedSpy}
        pageChanged={loadPageSpy}
        closeModal={closeModalSpy}
        modalSaved={modalSavedSpy}
        selected={adminUser()}
        query=""
        canSearch={canSearch}
        addButton={addButton}
        userHasSearched={true}
        canSearchSync={canSearchSync}
        loading={loading}
        renderOptionsConfig={renderOptionsConfig}
      >
        <h1>Children</h1>
      </ModalPicker>
    );

    return {
      modalPicker,
      queryChangedSpy,
      loadPageSpy,
      closeModalSpy,
      modalSavedSpy,
      addButtonSpy
    };
  }

  describe('ui', () => {
    test('without addButton and search', () => {
      const { modalPicker } = setup({ canSearch: false, showAddButton: false });
      expect(toJson(modalPicker)).toMatchSnapshot(
        'Component: ModalPicker => ui without addButton and search'
      );
    });

    test('with addButton and search', () => {
      const { modalPicker } = setup({ canSearch: true, showAddButton: true });
      expect(toJson(modalPicker)).toMatchSnapshot(
        'Component: ModalPicker => ui with addButton and search'
      );
    });

    test('canSearchSync true', () => {
      const { modalPicker } = setup({
        canSearch: true,
        canSearchSync: true
      });

      // @ts-expect-error Test mock
      expect(modalPicker.find('SearchInput').props().debounce).toBe(0);
    });

    test('canSearchSync false', () => {
      const { modalPicker } = setup({
        canSearch: true,
        canSearchSync: false
      });

      // @ts-expect-error Test mock
      expect(modalPicker.find('SearchInput').props().debounce).toBe(500);
    });

    test('without Pagination', () => {
      const { modalPicker } = setup({
        page: emptyPage()
      });
      expect(modalPicker.find('Pagination')).toEqual({});
    });

    test('with Pagination', () => {
      const { modalPicker } = setup({});
      expect(modalPicker.filter('Pagination')).not.toBeNull();
    });

    test('loading', () => {
      const { modalPicker } = setup({
        loading: true
      });
      expect(
        modalPicker.filter(<ContentState mode="loading" title="" />)
      ).not.toBeNull();
    });

    test('empty', () => {
      const { modalPicker } = setup({
        page: emptyPage()
      });
      expect(
        modalPicker.filter(<EmptyModal userHasSearched={false} />)
      ).not.toBeNull();
    });

    test('with children', () => {
      const { modalPicker } = setup({});
      expect(modalPicker.filter(<h1>Children</h1>)).not.toBeNull();
    });
  });

  describe('events', () => {
    it('should close the modal when the user clicks outside of the modal', () => {
      const { modalPicker, closeModalSpy } = setup({});

      modalPicker
        .find('Modal')
        .props()
        // @ts-expect-error Test mock
        .toggle();

      expect(closeModalSpy).toHaveBeenCalledTimes(1);
    });

    it('should close the modal when the user clicks the X in the modals header', () => {
      const { modalPicker, closeModalSpy } = setup({});

      modalPicker
        .find('ModalHeader')
        .props()
        // @ts-expect-error Test mock
        .toggle();

      expect(closeModalSpy).toHaveBeenCalledTimes(1);
    });

    it('should close the modal when the user clicks the "cancel" button', () => {
      const { modalPicker, closeModalSpy } = setup({});

      // @ts-expect-error Test mock
      modalPicker
        .find('Button')
        .at(0)
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(closeModalSpy).toHaveBeenCalledTimes(1);
    });

    it('should save the modal when the user clicks the "save" button', () => {
      const { modalPicker, modalSavedSpy } = setup({});

      // @ts-expect-error Test mock
      modalPicker
        .find('Button')
        .at(1)
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(modalSavedSpy).toHaveBeenCalledTimes(1);
    });

    it('should call search when user stops typing', () => {
      const { modalPicker, queryChangedSpy } = setup({});

      // @ts-expect-error Test mock
      modalPicker
        .find('SearchInput')
        .props()
        // @ts-expect-error Test mock
        .onChange('Maarten');

      expect(queryChangedSpy).toHaveBeenCalledTimes(1);
      expect(queryChangedSpy).toHaveBeenCalledWith('Maarten');
    });

    it('should load the next page when the pagination is used', () => {
      const { modalPicker, loadPageSpy } = setup({});

      // @ts-expect-error Test mock
      modalPicker
        .find('Pagination')
        .props()
        // @ts-expect-error Test mock
        .onChange(42);

      expect(loadPageSpy).toHaveBeenCalledTimes(1);
      expect(loadPageSpy).toHaveBeenCalledWith(42);
    });

    it('should trigger the addButtons callback when the add button is clicked', () => {
      const { modalPicker, addButtonSpy } = setup({
        showAddButton: true,
        canSearch: false
      });

      // @ts-expect-error Test mock
      modalPicker
        .find('Button')
        .at(0)
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(addButtonSpy).toHaveBeenCalledTimes(1);
      expect(addButtonSpy).toHaveBeenCalledWith();
    });
  });

  it('should when a renderOptionsConfig is provided render via renderOption and provide a working api for the developer', () => {
    const onChangeSpy = jest.fn();

    function renderOptions(
      options: RenderOptionsOption<User>[]
    ): React.ReactNode {
      return (
        <ListGroup>
          {options.map(
            ({ option, toggle, enabled }: RenderOptionsOption<User>) => (
              <ListGroupItem
                key={option.id}
                onClick={toggle}
                disabled={!enabled}
              >
                {option.email}
              </ListGroupItem>
            )
          )}
        </ListGroup>
      );
    }

    const { modalPicker } = setup({
      renderOptionsConfig: {
        labelForOption: (user) => user.email,
        isOptionEnabled: (user) => user.email !== 'user@42.nl',
        renderOptions,
        onChange: onChangeSpy
      }
    });

    // We should have three list group items
    const listGroupItems = modalPicker.find('ListGroupItem');
    expect(listGroupItems.length).toBe(3);

    const admin = listGroupItems.at(0);
    const coordinator = listGroupItems.at(1);
    const user = listGroupItems.at(2);

    // Now lets check the content
    expect(admin.children().text()).toBe('admin@42.nl');
    expect(coordinator.children().text()).toBe('coordinator@42.nl');
    expect(user.children().text()).toBe('user@42.nl');

    // Now lets check the disabled state only the user should be disabled
    expect(admin.props().disabled).toBe(false);
    expect(coordinator.props().disabled).toBe(false);
    expect(user.props().disabled).toBe(true);

    // Now lets call toggle on all options

    // The admin should already be selected
    // @ts-expect-error Test mock
    admin.props().onClick();
    expect(onChangeSpy).toBeCalledTimes(1);
    expect(onChangeSpy).toBeCalledWith(adminUser(), true);

    // The admin should not be selected
    // @ts-expect-error Test mock
    coordinator.props().onClick();
    expect(onChangeSpy).toBeCalledTimes(2);
    expect(onChangeSpy).toBeCalledWith(coordinatorUser(), false);

    // Clicking the user should do nothing because it is disabled
    // but the toggle should still be a function.
    // @ts-expect-error Test mock
    user.props().onClick();
    expect(onChangeSpy).toBeCalledTimes(2);
  });
});
