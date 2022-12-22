import React from 'react';
import { Mock, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { emptyPage, Page } from '@42.nl/spring-connect';

import { ModalPickerSingle } from './ModalPickerSingle';
import { User } from '../../../test/types';
import * as testUtils from '../../../test/utils';
import {
  adminUser,
  listOfUsers,
  pageOfUsersFetcher,
  randomUser
} from '../../../test/fixtures';
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

describe('Component: ModalPickerSingle', () => {
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
    isAsync,
    canClear,
    pageSize = 10,
    addButtonCallbackSpy
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
    addButtonCallbackSpy?: Mock;
  }) {
    const onChangeSpy = vi.fn();

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
      options: isAsync ? pageOfUsersFetcher : listOfUsers(),
      labelForOption: (user: User) => user.email,
      isOptionEnabled,
      canSearch,
      addButton,
      value,
      onChange: onChangeSpy,
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
      pageSize,
      id: hasLabel ? 'bestFriend' : undefined,
      label: 'Best Friend',
      hiddenLabel: !hasLabel
    };

    const { container, rerender } = render(<ModalPickerSingle {...props} />);

    return {
      container,
      props,
      rerender,
      onChangeSpy,
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

    test('with value', () => {
      setup({
        value: adminUser()
      });
      fireEvent.click(screen.getByText('Select your best friend'));
      // @ts-expect-error Checkbox has property checked
      expect(screen.getAllByRole('radio')[0].checked).toEqual(true);
      // @ts-expect-error Checkbox has property checked
      expect(screen.getAllByRole('radio')[1].checked).toEqual(false);
      // @ts-expect-error Checkbox has property checked
      expect(screen.getAllByRole('radio')[2].checked).toEqual(false);
    });

    test('without value', () => {
      const { container } = setup({});
      fireEvent.click(screen.getByText('Select your best friend'));
      expect(container).toMatchSnapshot();
      // @ts-expect-error Checkbox has property checked
      expect(screen.getAllByRole('radio')[0].checked).toEqual(false);
      // @ts-expect-error Checkbox has property checked
      expect(screen.getAllByRole('radio')[1].checked).toEqual(false);
      // @ts-expect-error Checkbox has property checked
      expect(screen.getAllByRole('radio')[2].checked).toEqual(false);
    });

    test('with label', async () => {
      expect.assertions(4);
      setup({
        hasLabel: true
      });
      await screen.findByText('Best Friend');
    });

    test('without label', () => {
      setup({
        hasLabel: false
      });
      expect(screen.queryByText('Best Friend')).toBeNull();
    });

    it('should disable options when isOptionEnabled is false', () => {
      setup({
        isOptionEnabled: (user) => user.email === 'admin@42.nl'
      });

      fireEvent.click(screen.getByText('Select your best friend'));

      // @ts-expect-error Form elements have property disabled
      expect(screen.getAllByRole('radio')[0].disabled).toEqual(false);
      // @ts-expect-error Form elements have property disabled
      expect(screen.getAllByRole('radio')[1].disabled).toEqual(true);
      // @ts-expect-error Form elements have property disabled
      expect(screen.getAllByRole('radio')[2].disabled).toEqual(true);
    });

    it('should only render 2 options when pageSize is set to 2', () => {
      setup({
        pageSize: 2
      });

      fireEvent.click(screen.getByText('Select your best friend'));

      expect(screen.getAllByRole('radio').length).toBe(2);
    });

    it('should render button left', () => {
      setup({
        value: adminUser(),
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
        value: adminUser(),
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
        value: adminUser(),
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
        await screen.queryByText('none selected');
      });

      it('should use the default ModalPickerValueTruncator to render values', () => {
        setup({
          value: adminUser(),
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
        value: adminUser(),
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
      setup({
        value: adminUser()
      });

      fireEvent.click(screen.getByText('Select your best friend'));

      expect(screen.queryAllByRole('radio').length).toBe(3);
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
      const { onChangeSpy } = setup({
        value: undefined
      });

      fireEvent.click(screen.getByText('Select your best friend'));
      fireEvent.click(screen.getByText('Cancel'));

      expect(onChangeSpy).toHaveBeenCalledTimes(0);
    });

    it('should call onChange when the user clicks select', () => {
      const { onChangeSpy } = setup({
        value: undefined
      });

      fireEvent.click(screen.getByText('Select your best friend'));
      fireEvent.click(screen.getAllByRole('radio')[0]);
      fireEvent.click(screen.getByText('Select'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(adminUser());
    });

    it('should clear the value when the user clicks the clear button', () => {
      const { onChangeSpy } = setup({ value: adminUser() });

      fireEvent.click(screen.getByText('Clear'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(undefined);
    });

    it('should change checked state but not call onChange when the user selects another option', () => {
      const { onChangeSpy } = setup({
        value: adminUser()
      });

      fireEvent.click(screen.getByText('Select your best friend'));
      fireEvent.click(screen.getAllByRole('radio')[1]);

      // @ts-expect-error Checkbox has property checked
      expect(screen.getAllByRole('radio')[0].checked).toEqual(false);
      // @ts-expect-error Checkbox has property checked
      expect(screen.getAllByRole('radio')[1].checked).toEqual(true);

      expect(onChangeSpy).toBeCalledTimes(0);
    });

    describe('addButton', () => {
      it('should add an item on the first position, when the promise resolves', async () => {
        expect.assertions(8);

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
        await act(async () => {
          resolve(addedUser);
          await expect(promise).resolves.toEqual(addedUser);
        });

        await screen.findByText(addedUser.email);
        expect(screen.queryAllByRole('radio').length).toBe(4);
        // @ts-expect-error Checkbox has property checked
        expect(screen.getAllByRole('radio')[0].checked).toEqual(true);
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

        await act(async () => {
          reject('error');
          await expect(promise).rejects.toEqual('error');
        });

        expect(screen.queryAllByRole('radio').length).toBe(3);
      });
    });
  });

  describe('value changes', () => {
    test('becomes empty', async () => {
      expect.assertions(5);

      const value = adminUser();

      const { props, rerender } = setup({ value });

      await screen.findByText('admin@42.nl');

      const newProps = {
        ...props,
        value: undefined
      };

      rerender(<ModalPickerSingle {...newProps} />);

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

      rerender(<ModalPickerSingle {...newProps} />);

      await screen.findByText('admin@42.nl');
    });
  });
});
