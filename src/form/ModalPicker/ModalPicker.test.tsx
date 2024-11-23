import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { emptyPage, Page } from '@42.nl/spring-connect';

import { ModalPicker, RenderOptionsConfig } from './ModalPicker';
import { User } from '../../test/types';
import {
  adminUser,
  coordinatorUser,
  pageOfUsers,
  userUser
} from '../../test/fixtures';
import { ModalPickerRenderOptionsOption } from './types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import lodash from 'lodash';
import { useOptions } from '../useOptions';

jest.mock('../useOptions', () => {
  return { useOptions: jest.fn() };
});

describe('Component: ModalPicker', () => {
  function setup({
    showAddButton,
    canSearch = true,
    page = pageOfUsers(),
    value,
    loading = false,
    renderOptionsConfig = {},
    canSearchSync = false,
    multiple
  }: {
    page?: Page<User>;
    value?: User | User[];
    showAddButton?: boolean;
    canSearch?: boolean;
    loading?: boolean;
    renderOptionsConfig?: RenderOptionsConfig<User>;
    canSearchSync?: boolean;
    multiple?: boolean;
  }) {
    const pageChangedSpy = jest.fn();
    const queryChangedSpy = jest.fn();
    const selectionSpy = jest.fn();
    const closeModalSpy = jest.fn();
    const modalSavedSpy = jest.fn();
    const addButtonSpy = jest.fn();
    const optionsSpy = jest.fn();

    jest
      .spyOn(React, 'useState')
      // @ts-expect-error This is in fact a mock
      .mockImplementationOnce((state) => [state, pageChangedSpy]);
    jest
      .spyOn(React, 'useState')
      // @ts-expect-error This is in fact a mock
      .mockImplementationOnce((state) => [state, queryChangedSpy]);
    jest
      .spyOn(React, 'useState')
      // @ts-expect-error This is in fact a mock
      .mockImplementationOnce((state) => [state, selectionSpy]);

    // @ts-expect-error This is in fact a mock
    useOptions.mockImplementation(() => {
      return {
        page,
        loading
      };
    });

    const addButton = showAddButton
      ? { label: 'Add color', onClick: addButtonSpy }
      : undefined;

    const props = multiple
      ? { multiple }
      : Array.isArray(value)
        ? {
            value,
            multiple: true
          }
        : {
            value
          };

    const { container } = render(
      <ModalPicker
        {...props}
        placeholder="Please select your favorite color"
        closeModal={closeModalSpy}
        modalSaved={modalSavedSpy}
        canSearch={canSearch}
        addButton={addButton}
        canSearchSync={canSearchSync}
        options={optionsSpy}
        labelForOption={(user) => user.email}
        renderOptionsConfig={renderOptionsConfig}
      >
        {() => <h1>Children</h1>}
      </ModalPicker>
    );

    return {
      container,
      pageChangedSpy,
      queryChangedSpy,
      selectionSpy,
      closeModalSpy,
      modalSavedSpy,
      addButtonSpy,
      optionsSpy
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

    test('with search sync', () => {
      expect.assertions(2);
      // @ts-expect-error Test mock
      jest.spyOn(lodash, 'debounce').mockImplementation((fn, debounceValue) => {
        expect(debounceValue).toBe(0);
        return fn;
      });
      setup({ canSearchSync: true });
    });

    test('without search sync', () => {
      expect.assertions(2);
      // @ts-expect-error Test mock
      jest.spyOn(lodash, 'debounce').mockImplementation((fn, debounceValue) => {
        expect(debounceValue).toBe(500);
        return fn;
      });
      setup({});
    });
  });

  describe('events', () => {
    it('should call closeModal when the user clicks the X in the modal header', () => {
      const { closeModalSpy } = setup({});

      fireEvent.click(screen.getByLabelText('Close'));

      expect(closeModalSpy).toHaveBeenCalledTimes(1);
    });

    it('should fetch options', () => {
      setup({
        value: undefined
      });

      expect(useOptions).toHaveBeenCalledTimes(1);
      expect(useOptions).toHaveBeenLastCalledWith(
        expect.objectContaining({ query: '', pageNumber: 1 })
      );
    });

    it('should set query when user stops typing', () => {
      // @ts-expect-error Test mock
      jest.spyOn(lodash, 'debounce').mockImplementation((fn) => {
        return fn;
      });

      const { queryChangedSpy } = setup({
        value: undefined
      });

      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'test' }
      });

      expect(queryChangedSpy).toHaveBeenCalledTimes(1);
      expect(queryChangedSpy).toHaveBeenCalledWith('test');
    });

    it('should change page when the user moves to another page', () => {
      const { pageChangedSpy } = setup({
        value: undefined
      });

      fireEvent.click(screen.getByText('arrow_forward'));

      expect(pageChangedSpy).toHaveBeenCalledTimes(1);
      expect(pageChangedSpy).toHaveBeenCalledWith(3);
    });

    it('should call closeModal when the user clicks cancel', () => {
      const { closeModalSpy, modalSavedSpy } = setup({});

      fireEvent.click(screen.getByText('Cancel'));

      expect(closeModalSpy).toHaveBeenCalledTimes(1);
      expect(modalSavedSpy).toHaveBeenCalledTimes(0);
    });

    it('should call modalSaved when the user clicks select', () => {
      const { modalSavedSpy } = setup({ value: adminUser() });

      fireEvent.click(screen.getByText('Select'));

      expect(modalSavedSpy).toHaveBeenCalledTimes(1);
      expect(modalSavedSpy).toHaveBeenCalledWith(adminUser());
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

  describe('should render via renderOptions and provide a working api for the developer when a renderOptionsConfig is provided', () => {
    it('single', () => {
      function renderOptions(
        options: ModalPickerRenderOptionsOption<User>[]
      ): React.ReactNode {
        return (
          <ListGroup>
            {options.map(
              ({ option, toggle }: ModalPickerRenderOptionsOption<User>) => (
                <ListGroupItem key={option.id} onClick={toggle}>
                  {option.email}
                </ListGroupItem>
              )
            )}
          </ListGroup>
        );
      }

      const { selectionSpy } = setup({
        value: coordinatorUser(),
        renderOptionsConfig: {
          isOptionEnabled: (user) => user.email !== 'admin@42.nl',
          renderOptions
        }
      });

      expect(screen.getByText('admin@42.nl')).toHaveClass('list-group-item');

      // Selecting disabled option should do nothing
      fireEvent.click(screen.getByText('admin@42.nl'));
      expect(selectionSpy).toHaveBeenCalledTimes(0);

      // Selecting selected value should unset value
      fireEvent.click(screen.getByText('coordinator@42.nl'));
      expect(selectionSpy).toHaveBeenCalledTimes(1);
      expect(selectionSpy).toHaveBeenCalledWith(undefined);

      fireEvent.click(screen.getByText('user@42.nl'));
      expect(selectionSpy).toHaveBeenCalledTimes(2);
      expect(selectionSpy).toHaveBeenLastCalledWith(userUser());
    });

    describe('multiple', () => {
      it('without value', () => {
        function renderOptions(
          options: ModalPickerRenderOptionsOption<User>[]
        ): React.ReactNode {
          return (
            <ListGroup>
              {options.map(
                ({ option, toggle }: ModalPickerRenderOptionsOption<User>) => (
                  <ListGroupItem key={option.id} onClick={toggle}>
                    {option.email}
                  </ListGroupItem>
                )
              )}
            </ListGroup>
          );
        }

        const { selectionSpy } = setup({
          multiple: true,
          renderOptionsConfig: {
            renderOptions
          }
        });

        expect(screen.getByText('admin@42.nl')).toHaveClass('list-group-item');

        fireEvent.click(screen.getByText('admin@42.nl'));
        expect(selectionSpy).toHaveBeenCalledTimes(1);
        expect(selectionSpy).toHaveBeenCalledWith([adminUser()]);
      });

      it('with value without isOptionEqual', () => {
        function renderOptions(
          options: ModalPickerRenderOptionsOption<User>[]
        ): React.ReactNode {
          return (
            <ListGroup>
              {options.map(
                ({ option, toggle }: ModalPickerRenderOptionsOption<User>) => (
                  <ListGroupItem key={option.id} onClick={toggle}>
                    {option.email}
                  </ListGroupItem>
                )
              )}
            </ListGroup>
          );
        }

        const { selectionSpy } = setup({
          renderOptionsConfig: {
            renderOptions
          },
          value: [adminUser()]
        });

        expect(screen.getByText('admin@42.nl')).toHaveClass('list-group-item');

        // Deselect should set an empty array
        fireEvent.click(screen.getByText('admin@42.nl'));
        expect(selectionSpy).toHaveBeenCalledTimes(1);
        expect(selectionSpy).toHaveBeenCalledWith([]);

        // Clicking another option should add it to the array
        fireEvent.click(screen.getByText('coordinator@42.nl'));
        expect(selectionSpy).toHaveBeenCalledTimes(2);
        expect(selectionSpy).toHaveBeenCalledWith([
          adminUser(),
          coordinatorUser()
        ]);
      });

      it('with isOptionEqual', () => {
        function renderOptions(
          options: ModalPickerRenderOptionsOption<User>[]
        ): React.ReactNode {
          return (
            <ListGroup>
              {options.map(
                ({ option, toggle }: ModalPickerRenderOptionsOption<User>) => (
                  <ListGroupItem key={option.id} onClick={toggle}>
                    {option.email}
                  </ListGroupItem>
                )
              )}
            </ListGroup>
          );
        }

        const { selectionSpy } = setup({
          renderOptionsConfig: {
            renderOptions,
            isOptionEqual: (a, b) => a.id === b.id
          },
          value: [adminUser()]
        });

        expect(screen.getByText('admin@42.nl')).toHaveClass('list-group-item');

        // Deselect should set an empty array
        fireEvent.click(screen.getByText('admin@42.nl'));
        expect(selectionSpy).toHaveBeenCalledTimes(1);
        expect(selectionSpy).toHaveBeenCalledWith([]);
      });
    });
  });
});
