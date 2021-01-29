import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import IconPicker from './IconPicker';
import { SearchInput, Icon, IconType, Pager } from '../..';
import { Button } from 'reactstrap';
import Popover from '../../core/Popover/Popover';
import TextButton from '../../core/TextButton/TextButton';

describe('Component: IconPicker', () => {
  function setup({
    value,
    hasLabel = true,
    hasIcon = false,
    canClear
  }: {
    value?: IconType;
    hasLabel?: boolean;
    hasIcon?: boolean;
    canClear?: boolean;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();
    const searchInputSetValueSpy = jest.fn();

    const props = {
      id: 'bestFriend',
      name: 'bestFriend',
      label: hasLabel ? 'Best Friend' : undefined,
      placeholder: 'Select your best friend',
      icon: hasIcon ? 'face' : undefined,
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      color: 'success',
      canClear
    };

    // @ts-expect-error Test mock
    const iconPickerParent = shallow(<IconPicker {...props} />);

    function updateIconPicker() {
      const searchInput = iconPickerParent.find(SearchInput);

      return shallow(
        // @ts-expect-error Test mock
        searchInput
          .props()
          .children(searchInput.debug(), { setValue: searchInputSetValueSpy })
      );
    }

    return {
      iconPickerParent,
      iconPicker: updateIconPicker(),
      updateIconPicker,
      onBlurSpy,
      onChangeSpy,
      searchInputSetValueSpy
    };
  }

  describe('ui', () => {
    test('with selected value', () => {
      const { iconPicker } = setup({ value: '3d_rotation' });

      expect(toJson(iconPicker)).toMatchSnapshot();
    });

    test('without selected value', () => {
      const { iconPicker } = setup({ value: undefined });

      expect(toJson(iconPicker)).toMatchSnapshot();
    });

    test('no results', () => {
      const { iconPickerParent, updateIconPicker } = setup({
        value: undefined
      });

      iconPickerParent
        .find(SearchInput)
        .props()
        .onChange('asdlfjalsdjflajsdlf');

      expect(toJson(updateIconPicker())).toMatchSnapshot();
    });

    test('without label', () => {
      const { iconPicker } = setup({ value: undefined, hasLabel: false });

      expect(toJson(iconPicker)).toMatchSnapshot();
    });

    test('with icon', () => {
      const { iconPicker } = setup({ hasIcon: true });

      const button = shallow(
        // @ts-expect-error Test mock
        iconPicker.find('Popover').props().target
      );
      expect(button.find('Icon').exists()).toBe(true);
    });

    test('without clear button', () => {
      const { iconPicker } = setup({ value: '3d_rotation', canClear: false });

      expect(iconPicker.find(TextButton).exists()).toBe(false);
    });
  });

  describe('events', () => {
    it('should open the popover when the select button is clicked', () => {
      const { iconPicker, updateIconPicker } = setup({
        value: undefined
      });

      const popover = iconPicker.find(Popover);

      expect(popover.props().isOpen).toBe(false);

      // @ts-expect-error Test mock
      popover
        // @ts-expect-error Test mock
        .shallow('target')
        .find(Button)
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(updateIconPicker().find(Popover).props().isOpen).toBe(true);
    });

    it('should filter the icons when the user searches and go back to the first page', () => {
      const { iconPickerParent, iconPicker, updateIconPicker } = setup({
        value: undefined
      });

      // First we go to the second page
      // @ts-expect-error Test mock
      iconPicker.find(Pager).props().onChange(2);

      // Now search for home which should make it go back to the first page
      iconPickerParent.find(SearchInput).props().onChange('home');

      expect(updateIconPicker().find(Icon).length).toBe(1);
    });

    it('should when the user moves to another page load the new page', () => {
      const { iconPicker, updateIconPicker } = setup({
        value: undefined
      });

      // The first icon on the first page is the 3d_rotation
      expect(iconPicker.find(Icon).first().props().icon).toBe('3d_rotation');

      // @ts-expect-error Test mock
      updateIconPicker().find(Pager).props().onChange(2);

      // The first icon on the second page is the calendar_today
      expect(updateIconPicker().find(Icon).first().props().icon).toBe(
        'calendar_today'
      );
    });

    it('should when the user selects an icon close the popover and call onChange', () => {
      const { iconPicker, onChangeSpy, onBlurSpy } = setup({
        value: undefined
      });

      // @ts-expect-error Test mock
      iconPicker
        .find(Icon)
        .at(0)
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(iconPicker.find(Popover).props().isOpen).toBe(false);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('3d_rotation');

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('should when the user clicks "clear" reset the icon', () => {
      const { iconPicker, onBlurSpy, onChangeSpy } = setup({ value: 'home' });

      // @ts-expect-error Test mock
      iconPicker
        .find('TextButton')
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(undefined);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('should when the popover closes clear the query', () => {
      const { iconPicker, updateIconPicker, searchInputSetValueSpy } = setup({
        value: undefined
      });

      let popover = iconPicker.find(Popover);

      expect(popover.props().isOpen).toBe(false);

      // @ts-expect-error Test mock
      popover
        // @ts-expect-error Test mock
        .shallow('target')
        .find(Button)
        .props()
        // @ts-expect-error Test mock
        .onClick();

      const updatedIconPicker = updateIconPicker();

      expect(updatedIconPicker.find(Popover).props().isOpen).toBe(true);

      popover = updatedIconPicker.find(Popover);

      // @ts-expect-error Test mock
      popover
        // @ts-expect-error Test mock
        .shallow('target')
        .find(Button)
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(searchInputSetValueSpy).toBeCalledTimes(1);
      expect(searchInputSetValueSpy).toBeCalledWith('');
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      const { iconPickerParent, iconPicker, updateIconPicker } = setup({
        value: 'home'
      });

      const value = iconPicker
        .find('#icon-picker-value')
        // @ts-expect-error Test mock
        .props().icon;
      expect(value).toBe('home');

      iconPickerParent.setProps({ value: undefined });

      expect(updateIconPicker().find('#icon-picker-value').exists()).toBe(
        false
      );
    });

    test('becomes filled', () => {
      const { iconPickerParent, iconPicker, updateIconPicker } = setup({
        value: undefined
      });

      expect(iconPicker.find('#icon-picker-value').exists()).toBe(false);

      iconPickerParent.setProps({
        value: 'home'
      });

      const value = updateIconPicker()
        .find('#icon-picker-value')
        // @ts-expect-error Test mock
        .props().icon;
      expect(value).toBe('home');
    });
  });
});
