import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { emptyPage, Page } from '@42.nl/spring-connect';

import ModalPicker from './ModalPicker';

describe('Component: ModalPicker', () => {
  let modalPicker: ShallowWrapper;

  let fetchDataSpy: jest.Mock;
  let loadPageSpy: jest.Mock;
  let closeModalSpy: jest.Mock;
  let modalSavedSpy: jest.Mock;
  let addButtonSpy: jest.Mock;

  function setup({
    showAddButton,
    canSearch,
    pageConfig
  }: {
    pageConfig?: Partial<Page<string>>;
    showAddButton: boolean;
    canSearch: boolean;
  }) {
    fetchDataSpy = jest.fn();
    loadPageSpy = jest.fn();
    closeModalSpy = jest.fn();
    modalSavedSpy = jest.fn();
    addButtonSpy = jest.fn();

    const page: Page<string> = Object.assign({}, emptyPage<string>(), {
      ...pageConfig
    });

    const addButton = showAddButton
      ? { label: 'Add color', onClick: addButtonSpy }
      : undefined;

    modalPicker = shallow(
      <ModalPicker
        placeholder="Please select your favorite color"
        isOpen={true}
        page={page}
        fetchOptions={fetchDataSpy}
        pageChanged={loadPageSpy}
        closeModal={closeModalSpy}
        modalSaved={modalSavedSpy}
        saveButtonEnabled={true}
        query=""
        canSearch={canSearch}
        addButton={addButton}
      >
        <h1>Children</h1>
      </ModalPicker>
    );
  }

  describe('ui', () => {
    test('without addButton and search', () => {
      setup({ showAddButton: false, canSearch: false });
      expect(toJson(modalPicker)).toMatchSnapshot(
        'Component: ModalPicker => ui without addButton and search'
      );
    });

    test('with addButton and search', () => {
      setup({ showAddButton: true, canSearch: true });
      expect(toJson(modalPicker)).toMatchSnapshot(
        'Component: ModalPicker => ui with addButton and search'
      );
    });

    test('without Pagination', () => {
      setup({ showAddButton: false, canSearch: false });
      expect(modalPicker.find('Pagination')).toEqual({});
    });

    test('with Pagination', () => {
      setup({
        showAddButton: false,
        canSearch: false,
        pageConfig: { first: true, last: false }
      });
      expect(modalPicker.filter('Pagination')).not.toBeNull();
    });
  });

  describe('events', () => {
    it('should close the modal when the user clicks outside of the modal', () => {
      setup({ showAddButton: false, canSearch: true });

      modalPicker
        .find('Modal')
        .props()
        // @ts-expect-error Test mock
        .toggle();

      expect(closeModalSpy).toHaveBeenCalledTimes(1);
    });

    it('should close the modal when the user clicks the X in the modals header', () => {
      setup({ showAddButton: false, canSearch: true });

      modalPicker
        .find('ModalHeader')
        .props()
        // @ts-expect-error Test mock
        .toggle();

      expect(closeModalSpy).toHaveBeenCalledTimes(1);
    });

    it('should close the modal when the user clicks the "cancel" button', () => {
      setup({ showAddButton: false, canSearch: true });

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
      setup({ showAddButton: false, canSearch: true });

      // @ts-expect-error Test mock
      modalPicker
        .find('Button')
        .at(1)
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(modalSavedSpy).toHaveBeenCalledTimes(1);
    });

    it('should call search stops typing', () => {
      setup({ showAddButton: false, canSearch: true });

      // @ts-expect-error Test mock
      modalPicker
        .find('SearchInput')
        .props()
        // @ts-expect-error Test mock
        .onChange('Maarten');

      expect(fetchDataSpy).toHaveBeenCalledTimes(1);
      expect(fetchDataSpy).toHaveBeenCalledWith('Maarten');
    });

    it('should load the next page when the pagination is used', () => {
      setup({
        showAddButton: false,
        canSearch: true,
        pageConfig: { first: true, last: false }
      });

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
      setup({ showAddButton: true, canSearch: false });

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
});
