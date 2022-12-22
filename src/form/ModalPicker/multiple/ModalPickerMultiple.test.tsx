import React from 'react';
import { Mock, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { emptyPage, Page } from '@42.nl/spring-connect';

import { ModalPickerMultiple } from './ModalPickerMultiple';
import {
  adminUser,
  coordinatorUser,
  listOfUsers,
  randomUser,
  userUser
} from '../../../test/fixtures';

import { User } from '../../../test/types';
import * as testUtils from '../../../test/utils';
import {
  ModalPickerAddButtonOptions,
  ModalPickerButtonAlignment
} from '../types';
import { pageOf } from '../../../utilities/page/page';
import { useOptions } from '../../useOptions';
import { Color } from '../../../core/types';
import { IsOptionEnabled } from '../../option';
import { icons } from '../../../core/Icon';
import lodash from 'lodash';

vi.mock('../../useOptions', () => {
  return { useOptions: vi.fn() };
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
    addButtonCallbackSpy?: Mock;
  }) {
    const onChangeSpy = vi.fn();
    const onBlurSpy = vi.fn();

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

    test('with label', async () => {
      expect.assertions(4);
      setup({
        hasLabel: true
      });
      await screen.findByText('Best friend');
    });

    test('with search', async () => {
      expect.assertions(4);
      setup({
        canSearch: true
      });
      fireEvent.click(screen.getByText('Select your best friend'));
      await screen.findByRole('searchbox');
    });

    test('without search', () => {
      setup({
        canSearch: false
      });
      fireEvent.click(screen.getByText('Select your best friend'));
      expect(screen.queryByRole('searchbox')).toBeNull();
    });

    test('with value', async () => {
      expect.assertions(6);

      setup({
        value: [adminUser(), userUser()]
      });

      await screen.findByText('admin@42.nl, user@42.nl');

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

      // @ts-expect-error Checkbox has property checked
      expect(screen.getAllByRole('checkbox')[0].checked).toEqual(true);
      // @ts-expect-error Checkbox has property checked
      expect(screen.getAllByRole('checkbox')[1].checked).toEqual(true);
      // @ts-expect-error Checkbox has property checked
      expect(screen.getAllByRole('checkbox')[2].checked).toEqual(false);
    });

    it('should disable options when isOptionEnabled is false', () => {
      setup({
        isOptionEnabled: (user) => user.email === 'admin@42.nl'
      });

      fireEvent.click(screen.getByText('Select your best friend'));

      // @ts-expect-error Form elements have property disabled
      expect(screen.getAllByRole('checkbox')[0].disabled).toEqual(false);
      // @ts-expect-error Form elements have property disabled
      expect(screen.getAllByRole('checkbox')[1].disabled).toEqual(true);
      // @ts-expect-error Form elements have property disabled
      expect(screen.getAllByRole('checkbox')[2].disabled).toEqual(true);
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
        screen
          .getByText('Select your best friend')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.classList.contains('align-items-center')
      ).toBe(true);
      expect(
        screen
          .getByText('Select your best friend')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.classList.contains('flex-row-reverse')
      ).toBe(true);
      expect(
        screen
          .getByText('Select your best friend')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.classList.contains('justify-content-end')
      ).toBe(true);
    });

    it('should render button right without value', () => {
      setup({
        alignButton: 'right'
      });
      expect(
        screen
          .getByText('Select your best friend')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.classList.contains('align-items-center')
      ).toBe(true);
      expect(
        screen
          .getByText('Select your best friend')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.classList.contains('flex-row-reverse')
      ).toBe(false);
      expect(
        screen
          .getByText('Select your best friend')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.classList.contains('justify-content-end')
      ).toBe(true);
    });

    it('should render button right with value', () => {
      setup({
        value: [adminUser()],
        alignButton: 'right'
      });
      expect(
        screen
          .getByText('Select your best friend')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.classList.contains('align-items-center')
      ).toBe(true);
      expect(
        screen
          .getByText('Select your best friend')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.classList.contains('flex-row-reverse')
      ).toBe(false);
      expect(
        screen
          .getByText('Select your best friend')
          // @ts-expect-error HTMLElement has property classList
          .parentNode?.classList.contains('justify-content-between')
      ).toBe(true);
    });

    it('should render without clear button', () => {
      setup({
        value: [adminUser()],
        canClear: false
      });
      expect(screen.queryByText('Clear')).toBeNull();
    });

    describe('renderValue', () => {
      it('should be able to use custom function to render values', async () => {
        expect.assertions(4);
        setup({
          hasRenderValue: true
        });
        await screen.findByText('none selected');
      });

      it('should use the default ModalPickerValueTruncator to render values', () => {
        setup({
          value: [adminUser()],
          hasRenderValue: false
        });
        expect(
          screen.getByText('admin@42.nl').classList.contains('text-truncate')
        ).toBe(true);
      });
    });

    it('should be able to use custom function to render options', async () => {
      expect.assertions(4);

      setup({
        value: [adminUser()],
        hasRenderOptions: true
      });

      fireEvent.click(screen.getByText('Select your best friend'));

      await screen.findByText('RenderOptions');
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

    it('should fetch options when the user searches', () => {
      // @ts-expect-error Test mock
      vi.spyOn(lodash, 'debounce').mockImplementation((fn) => {
        return fn;
      });

      setup({
        value: undefined
      });

      fireEvent.click(screen.getByText('Select your best friend'));
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'test' }
      });

      expect(useOptions).toHaveBeenLastCalledWith(
        expect.objectContaining({ query: 'test', pageNumber: 1 })
      );
    });

    it('should load the new page when the user moves to another page', () => {
      setup({
        value: undefined,
        pageSize: 2
      });

      fireEvent.click(screen.getByText('Select your best friend'));
      fireEvent.click(screen.getByText('arrow_forward'));

      expect(useOptions).toHaveBeenLastCalledWith(
        expect.objectContaining({ pageNumber: 2 })
      );
    });

    it('should not call onChange when the user clicks cancel', () => {
      const { onChangeSpy, onBlurSpy } = setup({
        value: undefined
      });

      fireEvent.click(screen.getByText('Select your best friend'));
      fireEvent.click(screen.getByText('Cancel'));

      expect(onChangeSpy).toHaveBeenCalledTimes(0);
      expect(onBlurSpy).toHaveBeenCalledTimes(0);
    });

    it('should call onChange when the user clicks select', () => {
      const { onChangeSpy, onBlurSpy } = setup({
        value: undefined
      });

      fireEvent.click(screen.getByText('Select your best friend'));
      fireEvent.click(screen.getAllByRole('checkbox')[0]);
      fireEvent.click(screen.getByText('Select'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith([adminUser()]);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
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

      expect(onChangeSpy).toBeCalledTimes(1);
      expect(onChangeSpy).toBeCalledWith([]);
    });

    describe('addButton', () => {
      it('should add an item on the first position, when the promise resolves', async () => {
        expect.assertions(9);

        const { promise, resolve } = testUtils.resolvablePromise();
        const addButtonCallbackSpy = vi.fn().mockReturnValueOnce(promise);

        setup({
          value: undefined,
          showAddButton: true,
          reUsePage: true,
          addButtonCallbackSpy
        });

        fireEvent.click(screen.getByText('Select your best friend'));
        fireEvent.click(screen.getByText('Add color'));

        expect(addButtonCallbackSpy).toHaveBeenCalledTimes(1);

        const addedUser = randomUser();
        resolve(addedUser);

        await act(async () => {
          await expect(promise).resolves.toEqual(addedUser);
        });

        expect(screen.queryAllByText(addedUser.email).length).toBe(2);
        expect(screen.queryAllByRole('checkbox').length).toBe(4);
        // @ts-expect-error Checkbox has property checked
        expect(screen.getAllByRole('checkbox')[0].checked).toEqual(true);
      });

      it('should hide when the promise is rejected', async () => {
        expect.assertions(7);

        const { promise, reject } = testUtils.rejectablePromise();
        const addButtonCallbackSpy = vi.fn().mockReturnValueOnce(promise);

        setup({
          value: undefined,
          showAddButton: true,
          addButtonCallbackSpy
        });

        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Add color'));

        expect(addButtonCallbackSpy).toHaveBeenCalledTimes(1);

        reject('error');

        await act(async () => {
          await expect(promise).rejects.toEqual('error');
        });

        expect(screen.queryAllByRole('checkbox').length).toBe(3);
      });
    });
  });

  describe('value changes', () => {
    test('becomes empty', async () => {
      expect.assertions(5);

      const value = [adminUser()];

      const { props, rerender } = setup({ value: value });

      await screen.findByText('admin@42.nl');

      const newProps = {
        ...props,
        value: undefined
      };

      rerender(<ModalPickerMultiple {...newProps} />);

      expect(screen.queryByText('admin@42.nl')).toBeNull();
    });

    test('becomes filled', async () => {
      expect.assertions(5);

      const { props, rerender } = setup({});

      expect(screen.queryByText('admin@42.nl')).toBeNull();

      const newProps = {
        ...props,
        value: [adminUser()]
      };

      rerender(<ModalPickerMultiple {...newProps} />);

      await screen.queryByText('admin@42.nl');
    });
  });
});
