import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

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
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    const props = {
      id: 'bestFriend',
      name: 'bestFriend',
      label: hasLabel ? 'Best Friend' : undefined,
      placeholder: 'Select your best friend',
      icon: hasIcon ? 'face' as IconType : undefined,
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
      expect.assertions(1);

      setup({
        value: undefined
      });

      fireEvent.click(screen.getByText('Select your best friend'));
      await userEvent.type(screen.getByRole('searchbox'), 'asdlfjalsdjflajsdlf');

      expect(screen.queryByText('No icons found')).toBeInTheDocument();
    });

    test('with label', () => {
      const { container } = setup({ hasLabel: true });
      expect(screen.queryByText('Best Friend')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });

    test('without label', () => {
      setup({ hasLabel: false });
      expect(screen.queryByText('Best Friend')).not.toBeInTheDocument();
    });

    test('with icon', () => {
      setup({ hasIcon: true });
      expect(screen.getByText('face')).toBeInTheDocument();
    });

    test('without clear button', () => {
      setup({ value: '3d_rotation', canClear: false });
      expect(screen.queryByText('clear')).not.toBeInTheDocument();
    });
  });

  describe('events', () => {
    it('should open the popover when the select button is clicked', () => {
      const setIsOpenSpy = jest.fn();
      jest.spyOn(React, 'useState')
        .mockReturnValueOnce([false, setIsOpenSpy]);

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
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'home' } });

      expect(screen.queryAllByText('home').length).toBe(0);
    });

    it('should when the user moves to another page load the new page', () => {
      setup({
        value: undefined
      });

      fireEvent.click(screen.getByText('Select your best friend'));

      // The first icon on the first page is the 3d_rotation
      expect(screen.getByText('10k')).toBeInTheDocument();

      fireEvent.click(screen.getByText('arrow_forward'));

      expect(screen.queryByText('10k')).not.toBeInTheDocument();
      expect(screen.getByText('4mp')).toBeInTheDocument();
    });

    it('should close the popover and call onChange when the user selects an icon', () => {
      const setIsOpenSpy = jest.fn();
      jest.spyOn(React, 'useState')
        .mockReturnValueOnce([true, setIsOpenSpy]);

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
      const setQuery = jest.fn();
      jest.spyOn(React, 'useState')
        .mockReturnValueOnce([true, jest.fn()])
        .mockReturnValueOnce([1, jest.fn()])
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
    test('becomes empty', () => {
      const { props, rerender } = setup({
        value: 'home'
      });

      expect(screen.getByText('home')).toBeInTheDocument();

      const newProps = {
        ...props,
        value: undefined
      };

      rerender(
        <IconPicker color="success" {...newProps} />
      );

      expect(screen.queryByText('home')).not.toBeInTheDocument();
    });

    test('becomes filled', () => {
      const { props, rerender } = setup({
        value: undefined
      });

      expect(screen.queryByText('home')).not.toBeInTheDocument();

      const newProps = {
        ...props,
        value: 'home' as IconType
      };

      rerender(
        <IconPicker color="success" {...newProps} />
      );

      expect(screen.getByText('home')).toBeInTheDocument();
    });
  });
});
