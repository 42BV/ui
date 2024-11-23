import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { emptyPage, Page, pageOf } from '@42.nl/spring-connect';

import { ModalPickerMultiple } from './ModalPickerMultiple';
import {
  adminUser,
  coordinatorUser,
  listOfUsers,
  userUser
} from '../../../test/fixtures';

import { User } from '../../../test/types';
import {
  ModalPickerAddButtonOptions,
  ModalPickerButtonAlignment
} from '../types';
import { useOptions } from '../../useOptions';
import { Color } from '../../../core/types';
import { IsOptionEnabled } from '../../option';
import { icons } from '../../../core/Icon';

jest.mock('../../useOptions', () => {
  return { useOptions: jest.fn() };
});

describe('Component: ModalPickerMultiple', () => {
  function setup({
    value,
    showAddButton,
    canSearch,
    hasLabel,
    alignButton,
    hasRenderValue,
    hasRenderOptions,
    loading,
    empty,
    reUsePage,
    isOptionEnabled,
    canClear,
    pageSize = 10,
    addButtonCallbackSpy
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
    canClear?: boolean;
    pageSize?: number;
    addButtonCallbackSpy?: jest.Mock;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    // We might reuse the page, so it can be unshifted by `addButtonClicked`
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

    // @ts-expect-error Test mock
    const addButton: ModalPickerAddButtonOptions<User> = showAddButton
      ? { label: 'Add color', onClick: addButtonCallbackSpy }
      : undefined;

    const props = {
      name: 'bestFriend',
      placeholder: 'Select your best friend',
      icon: icons['face'],
      canSearch,
      options: listOfUsers(),
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
      canClear,
      pageSize,
      id: hasLabel ? 'bestFriend' : undefined,
      label: 'Best friend',
      hiddenLabel: !hasLabel
    };

    const { container, rerender } = render(<ModalPickerMultiple {...props} />);

    return {
      container,
      props,
      rerender,
      onChangeSpy,
      onBlurSpy,
      addButtonCallbackSpy,
      page
    };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      fireEvent.click(screen.getByText('Select your best friend'));
      expect(container).toMatchSnapshot();
      expect(document.body.lastChild).toMatchSnapshot('modal');
    });

    test('with label', () => {
      setup({
        hasLabel: true
      });
      expect(screen.queryByText('Best friend')).toBeInTheDocument();
    });

    test('with search', () => {
      setup({
        canSearch: true
      });
      fireEvent.click(screen.getByText('Select your best friend'));
      expect(screen.queryByRole('searchbox')).toBeInTheDocument();
    });

    test('without search', () => {
      setup({
        canSearch: false
      });
      fireEvent.click(screen.getByText('Select your best friend'));
      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    });

    test('with value', () => {
      setup({
        value: [adminUser(), userUser()]
      });

      expect(screen.queryByText('admin@42.nl, user@42.nl')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Select your best friend'));

      expect(screen.queryAllByText('×').length).toBe(2);
      expect(
        screen.queryAllByText('×').map((e) => e.parentNode?.textContent)
      ).toEqual(['admin@42.nl×', 'user@42.nl×']);
    });

    test('without value', () => {
      const { container } = setup({});

      expect(container).toMatchSnapshot();

      fireEvent.click(screen.getByText('Select your best friend'));

      expect(screen.queryAllByText('×').length).toBe(0);
    });

    it('should render the options with the correct checked state', () => {
      setup({
        value: [adminUser(), coordinatorUser()]
      });

      fireEvent.click(screen.getByText('Select your best friend'));

      expect(screen.getAllByRole('checkbox')[0]).toBeChecked();
      expect(screen.getAllByRole('checkbox')[1]).toBeChecked();
      expect(screen.getAllByRole('checkbox')[2]).not.toBeChecked();
    });

    it('should disable options when isOptionEnabled is false', () => {
      setup({
        isOptionEnabled: (user) => user.email === 'admin@42.nl'
      });

      fireEvent.click(screen.getByText('Select your best friend'));

      expect(screen.getAllByRole('checkbox')[0]).not.toBeDisabled();
      expect(screen.getAllByRole('checkbox')[1]).toBeDisabled();
      expect(screen.getAllByRole('checkbox')[2]).toBeDisabled();
    });

    it('should only render 2 options when pageSize is set to 2', () => {
      setup({
        pageSize: 2
      });

      fireEvent.click(screen.getByText('Select your best friend'));

      expect(screen.getAllByRole('checkbox').length).toBe(2);
    });

    it('should render button left', () => {
      setup({
        value: [adminUser()],
        alignButton: 'left'
      });

      expect(
        screen.getByText('Select your best friend').parentNode
      ).toHaveClass('align-items-center flex-row-reverse justify-content-end');
    });

    it('should render button right without value', () => {
      setup({
        alignButton: 'right'
      });
      expect(
        screen.getByText('Select your best friend').parentNode
      ).toHaveClass('align-items-center justify-content-end');
      expect(
        screen.getByText('Select your best friend').parentNode
      ).not.toHaveClass('flex-row-reverse');
    });

    it('should render button right with value', () => {
      setup({
        value: [adminUser()],
        alignButton: 'right'
      });
      expect(
        screen.getByText('Select your best friend').parentNode
      ).toHaveClass('align-items-center justify-content-between');
      expect(
        screen.getByText('Select your best friend').parentNode
      ).not.toHaveClass('flex-row-reverse');
    });

    it('should render without clear button', () => {
      setup({
        value: [adminUser()],
        canClear: false
      });
      expect(screen.queryByText('Clear')).not.toBeInTheDocument();
    });

    describe('renderValue', () => {
      it('should be able to use custom function to render values', () => {
        setup({
          hasRenderValue: true
        });
        expect(screen.queryByText('none selected')).toBeInTheDocument();
      });

      it('should use the default ModalPickerValueTruncator to render values', () => {
        setup({
          value: [adminUser()],
          hasRenderValue: false
        });
        expect(screen.getByText('admin@42.nl')).toHaveClass('text-truncate');
      });
    });

    it('should be able to use custom function to render options', () => {
      setup({
        value: [adminUser()],
        hasRenderOptions: true
      });

      fireEvent.click(screen.getByText('Select your best friend'));

      expect(screen.queryByText('RenderOptions')).toBeInTheDocument();
    });

    test('loading', () => {
      setup({
        loading: true
      });
      fireEvent.click(screen.getByText('Select your best friend'));
      expect(document.body.lastChild).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should open the modal when the select button is clicked', () => {
      setup({});

      fireEvent.click(screen.getByText('Select your best friend'));

      expect(screen.queryAllByRole('checkbox').length).toBe(3);
    });

    it('should close the modal when the cancel button is clicked', () => {
      setup({});

      fireEvent.click(screen.getByText('Select your best friend'));

      expect(screen.queryAllByRole('checkbox').length).toBe(3);

      fireEvent.click(screen.getByText('Cancel'));

      expect(screen.queryAllByRole('checkbox').length).toBe(0);
    });

    it('should clear the value when the user clicks the clear button', () => {
      const { onChangeSpy } = setup({
        value: [adminUser(), coordinatorUser()]
      });

      fireEvent.click(screen.getByText('Clear'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(undefined);
    });

    it('should remove the value after clicking select when the user removes a selected value via the tag inside the modal', () => {
      const { onChangeSpy } = setup({
        value: [adminUser()]
      });

      fireEvent.click(screen.getByText('Select your best friend'));
      fireEvent.click(screen.getByText('×'));
      fireEvent.click(screen.getByText('Select'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith([]);
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      const value = [adminUser()];

      const { props, rerender } = setup({ value: value });

      expect(screen.queryByText('admin@42.nl')).toBeInTheDocument();

      const newProps = {
        ...props,
        value: undefined
      };

      rerender(<ModalPickerMultiple {...newProps} />);

      expect(screen.queryByText('admin@42.nl')).not.toBeInTheDocument();
    });

    test('becomes filled', () => {
      const { props, rerender } = setup({});

      expect(screen.queryByText('admin@42.nl')).not.toBeInTheDocument();

      const newProps = {
        ...props,
        value: [adminUser()]
      };

      rerender(<ModalPickerMultiple {...newProps} />);

      expect(screen.queryByText('admin@42.nl')).toBeInTheDocument();
    });
  });
});
