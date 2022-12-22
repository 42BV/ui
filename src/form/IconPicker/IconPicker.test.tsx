import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { IconPicker } from './IconPicker';
import { IconType } from '../../core/Icon';

describe('Component: IconPicker', () => {
  function setup({
    value,
    hasLabel,
    hasIcon,
    canClear
  }: {
    value?: IconType;
    hasLabel?: boolean;
    hasIcon?: boolean;
    canClear?: boolean;
  }) {
    const onChangeSpy = vi.fn();
    const onBlurSpy = vi.fn();

    const props = {
      id: 'bestFriend',
      name: 'bestFriend',
      label: 'Best Friend',
      hiddenLabel: !hasLabel,
      placeholder: 'Select your best friend',
      icon: hasIcon ? ('face' as IconType) : undefined,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      canClear
    };

    const { container, asFragment, rerender } = render(
      <IconPicker color="success" {...props} />
    );

    return {
      container,
      props,
      rerender,
      asFragment,
      onBlurSpy,
      onChangeSpy
    };
  }

  describe('ui', () => {
    test('with selected value', () => {
      const { container } = setup({ value: '3d_rotation' });
      expect(container).toMatchSnapshot();
    });

    test('without selected value', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('no results', async () => {
      expect.assertions(0);

      setup({
        value: undefined
      });

      fireEvent.click(screen.getByText('Select your best friend'));
      await userEvent.type(screen.getByRole('searchbox'), 'we are testing');

      await screen.findByText('No icons found');
    });

    test('with label', async () => {
      expect.assertions(1);
      const { container } = setup({ hasLabel: true });
      await screen.findByText('Best Friend');
      expect(container).toMatchSnapshot();
    });

    test('without label', () => {
      setup({ hasLabel: false });
      expect(screen.queryByText('Best Friend')).toBeNull();
    });

    test('with icon', async () => {
      expect.assertions(0);
      setup({ hasIcon: true });
      await screen.findByText('face');
    });

    test('without clear button', () => {
      setup({ value: '3d_rotation', canClear: false });
      expect(screen.queryByText('clear')).toBeNull();
    });
  });

  describe('events', () => {
    it('should open the popover when the select button is clicked', () => {
      const setIsOpenSpy = vi.fn();
      vi.spyOn(React, 'useState').mockReturnValueOnce([false, setIsOpenSpy]);

      setup({
        value: undefined,
        hasIcon: false
      });

      expect(setIsOpenSpy).toHaveBeenCalledTimes(0);

      fireEvent.click(screen.getByText('Select your best friend'));

      expect(setIsOpenSpy).toHaveBeenCalledTimes(1);
    });

    it('should filter the icons when the user searches and go back to the first page', () => {
      setup({
        value: undefined,
        hasIcon: true
      });

      fireEvent.click(screen.getByText('face'));
      fireEvent.change(screen.getByRole('searchbox'), {
        target: { value: 'home' }
      });

      expect(screen.queryAllByText('home').length).toBe(0);
    });

    it('should when the user moves to another page load the new page', async () => {
      expect.assertions(1);

      setup({
        value: undefined
      });

      fireEvent.click(screen.getByText('Select your best friend'));

      // The first icon on the first page is the 3d_rotation
      await screen.findByText('10k');

      fireEvent.click(screen.getByText('arrow_forward'));

      await screen.findByText('4mp');
      expect(screen.queryByText('10k')).toBeNull();
    });

    it('should close the popover and call onChange when the user selects an icon', () => {
      const setIsOpenSpy = vi.fn();
      vi.spyOn(React, 'useState').mockReturnValueOnce([true, setIsOpenSpy]);

      const { onBlurSpy, onChangeSpy } = setup({
        value: undefined
      });

      fireEvent.click(screen.getByText('10k'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('10k');

      expect(onBlurSpy).toHaveBeenCalledTimes(1);

      expect(setIsOpenSpy).toHaveBeenCalledTimes(1);
      expect(setIsOpenSpy).toHaveBeenCalledWith(false);
    });

    it('should when the user clicks "clear" reset the icon', () => {
      const { onBlurSpy, onChangeSpy } = setup({ value: 'home' });

      fireEvent.click(screen.getByText('Clear'));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(undefined);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('should when the popover closes clear the query', () => {
      const setQuery = vi.fn();
      vi.spyOn(React, 'useState')
        .mockReturnValueOnce([true, vi.fn()])
        .mockReturnValueOnce([1, vi.fn()])
        .mockReturnValueOnce(['home', setQuery]);

      setup({
        value: undefined
      });

      fireEvent.click(screen.getByText('Select your best friend'));

      expect(setQuery).toHaveBeenCalledTimes(1);
      expect(setQuery).toHaveBeenCalledWith('');
    });
  });

  describe('value changes', () => {
    test('becomes empty', async () => {
      expect.assertions(1);

      const { props, rerender } = setup({
        value: 'home'
      });

      await screen.findByText('home');

      const newProps = {
        ...props,
        value: undefined
      };

      rerender(<IconPicker color="success" {...newProps} />);

      expect(screen.queryByText('home')).toBeNull();
    });

    test('becomes filled', async () => {
      expect.assertions(1);

      const { props, rerender } = setup({
        value: undefined
      });

      expect(screen.queryByText('home')).toBeNull();

      const newProps = {
        ...props,
        value: 'home' as IconType
      };

      rerender(<IconPicker color="success" {...newProps} />);

      await screen.findByText('home');
    });
  });
});
