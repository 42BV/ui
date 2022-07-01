import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { emptyPage, Page } from '@42.nl/spring-connect';

import ModalPicker, { RenderOptionsConfig } from './ModalPicker';
import { User } from '../../test/types';
import { adminUser, coordinatorUser, pageOfUsers, userUser } from '../../test/fixtures';
import { ModalPickerRenderOptionsOption } from './types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import lodash from 'lodash';

describe('Component: ModalPicker', () => {
  function setup({
    showAddButton,
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
    const pageChangedSpy = jest.fn();
    const closeModalSpy = jest.fn();
    const modalSavedSpy = jest.fn();
    const addButtonSpy = jest.fn();

    const addButton = showAddButton
      ? { label: 'Add color', onClick: addButtonSpy }
      : undefined;

    const { container } = render(
      <ModalPicker
        placeholder="Please select your favorite color"
        isOpen={true}
        page={page}
        queryChanged={queryChangedSpy}
        pageChanged={pageChangedSpy}
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
      container,
      queryChangedSpy,
      pageChangedSpy,
      closeModalSpy,
      modalSavedSpy,
      addButtonSpy
    };
  }

  describe('ui', () => {
    test('default', () => {
      setup({});
      expect(document.body.lastChild).toMatchSnapshot();
    });

    test('without addButton and search', () => {
      setup({ canSearch: false, showAddButton: false });
      expect(screen.queryByText('Add color')).not.toBeInTheDocument();
      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    });

    test('with addButton and search', () => {
      setup({ canSearch: true, showAddButton: true });
      expect(screen.queryByText('Add color')).toBeInTheDocument();
      expect(screen.queryByRole('searchbox')).toBeInTheDocument();
    });

    test('without Pagination', () => {
      setup({ page: emptyPage() });
      expect(screen.queryByText('arrow_forward')).not.toBeInTheDocument();
    });

    test('with Pagination', () => {
      setup({});
      expect(screen.queryByText('arrow_forward')).toBeInTheDocument();
    });

    test('loading', () => {
      setup({ loading: true });
      expect(document.body.lastChild).toMatchSnapshot();
    });

    test('empty', () => {
      setup({ page: emptyPage() });
      expect(screen.queryByText('Empty')).toBeInTheDocument();
    });

    test('with children', () => {
      setup({});
      expect(screen.queryByText('Children')).toBeInTheDocument();
    });
  });

  describe('events', () => {
    it('should call closeModal when the user clicks the X in the modal header', () => {
      const { closeModalSpy } = setup({});

      fireEvent.click(screen.getByLabelText('Close'));

      expect(closeModalSpy).toHaveBeenCalledTimes(1);
    });

    it('should call closeModal when the user clicks cancel', () => {
      const { closeModalSpy } = setup({});

      fireEvent.click(screen.getByText('Cancel'));

      expect(closeModalSpy).toHaveBeenCalledTimes(1);
    });

    it('should call modalSaved when the user clicks select', () => {
      const { modalSavedSpy } = setup({});

      fireEvent.click(screen.getByText('Select'));

      expect(modalSavedSpy).toHaveBeenCalledTimes(1);
    });

    it('should call search when user stops typing', () => {
      // @ts-expect-error Test mock
      jest.spyOn(lodash, 'debounce').mockImplementation((fn) => {
        return fn;
      });

      const { queryChangedSpy } = setup({});

      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Maarten' } });

      expect(queryChangedSpy).toHaveBeenCalledTimes(1);
      expect(queryChangedSpy).toHaveBeenCalledWith('Maarten');
    });

    it('should call pageChanged when the pagination is used', () => {
      const { pageChangedSpy } = setup({});

      fireEvent.click(screen.getByText('arrow_forward'));

      expect(pageChangedSpy).toHaveBeenCalledTimes(1);
      expect(pageChangedSpy).toHaveBeenCalledWith(3);
    });

    it('should call addButton when the add button is clicked', () => {
      const { addButtonSpy } = setup({
        showAddButton: true
      });

      fireEvent.click(screen.getByText('Add color'));

      expect(addButtonSpy).toHaveBeenCalledTimes(1);
      expect(addButtonSpy).toHaveBeenCalledWith();
    });
  });

  it('should render via renderOption and provide a working api for the developer when a renderOptionsConfig is provided', () => {
    const onChangeSpy = jest.fn();

    function renderOptions(
      options: ModalPickerRenderOptionsOption<User>[]
    ): React.ReactNode {
      return (
        <ListGroup>
          {options.map(
            ({
              option,
              toggle
            }: ModalPickerRenderOptionsOption<User>) => (
              <ListGroupItem
                key={option.id}
                onClick={toggle}
              >
                {option.email}
              </ListGroupItem>
            )
          )}
        </ListGroup>
      );
    }

    setup({
      renderOptionsConfig: {
        labelForOption: (user) => user.email,
        isOptionEnabled: (user) => user.email !== 'admin@42.nl',
        renderOptions,
        onChange: onChangeSpy
      }
    });

    expect(screen.getByText('admin@42.nl')).toHaveClass('list-group-item');

    fireEvent.click(screen.getByText('admin@42.nl'));
    expect(onChangeSpy).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('coordinator@42.nl'));
    expect(onChangeSpy).toBeCalledTimes(1);
    expect(onChangeSpy).toBeCalledWith(coordinatorUser(), false);

    fireEvent.click(screen.getByText('user@42.nl'));
    expect(onChangeSpy).toBeCalledTimes(2);
    expect(onChangeSpy).toBeCalledWith(userUser(), false);
  });
});
