import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import IconPicker from './IconPicker';
import { SearchInput, Icon, IconType, Pager } from '../..';
import { UncontrolledPopover, Button } from 'reactstrap';

describe('Component: IconPicker', () => {
  function setup({
    value,
    hasLabel = true
  }: {
    value?: IconType;
    hasLabel?: boolean;
  }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();
    const searchInputSetValueSpy = jest.fn();

    const props = {
      id: 'bestFriend',
      name: 'bestFriend',
      label: hasLabel ? 'Best Friend' : undefined,
      placeholder: 'Select your best friend',
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      color: 'success'
    };

    // @ts-ignore
    const iconPickerParent = shallow(<IconPicker {...props} />);

    function updateIconPicker() {
      const searchInput = iconPickerParent.find(SearchInput);

      return shallow(
        // @ts-ignore
        searchInput
          .props()
          // @ts-ignore
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
  });

  describe('events', () => {
    it('should open the popover when the select button is clicked', () => {
      const { iconPicker, updateIconPicker } = setup({
        value: undefined
      });

      const popover = iconPicker.find(UncontrolledPopover);

      expect(popover.props().isOpen).toBe(false);

      // Check that the target is the same.
      expect(popover.props().target).toBe('icon-picker-popover');
      expect(iconPicker.find(Button).props().id).toBe('icon-picker-popover');

      // @ts-ignore
      popover.props().toggle();

      expect(
        updateIconPicker()
          .find(UncontrolledPopover)
          .props().isOpen
      ).toBe(true);
    });

    it('should filter the icons when the user searches and go back to the first page', () => {
      const { iconPickerParent, iconPicker, updateIconPicker } = setup({
        value: undefined
      });

      // First we go to the second page
      iconPicker
        .find(Pager)
        .props()
        // @ts-ignore
        .onChange(2);

      // Now search for home which should make it go back to the first page
      iconPickerParent
        .find(SearchInput)
        .props()
        .onChange('home');

      expect(updateIconPicker().find(Icon).length).toBe(1);
    });

    it('should when the user moves to another page load the new page', () => {
      const { iconPicker, updateIconPicker } = setup({
        value: undefined
      });

      // The first icon on the first page is the 3d_rotation
      expect(
        iconPicker
          .find(Icon)
          .first()
          .props().icon
      ).toBe('3d_rotation');

      updateIconPicker()
        .find(Pager)
        .props()
        // @ts-ignore
        .onChange(2);

      // The first icon on the second page is the calendar_today
      expect(
        updateIconPicker()
          .find(Icon)
          .first()
          .props().icon
      ).toBe('calendar_today');
    });

    it('should when the user selects an icon close the popover and call onChange', () => {
      const { iconPicker, onChangeSpy, onBlurSpy } = setup({
        value: undefined
      });

      iconPicker
        .find(Icon)
        .at(0)
        .props()
        //@ts-ignore
        .onClick();

      expect(iconPicker.find(UncontrolledPopover).props().isOpen).toBe(false);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('3d_rotation');

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('should when the user clicks "clear" reset the icon', () => {
      const { iconPicker, onBlurSpy, onChangeSpy } = setup({ value: 'home' });

      iconPicker
        .find('u')
        .props()
        // @ts-ignore
        .onClick();

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(undefined);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });

    it('should when closes the popover clear the query', () => {
      const { iconPicker, updateIconPicker, searchInputSetValueSpy } = setup({
        value: undefined
      });

      let popover = iconPicker.find(UncontrolledPopover);

      expect(popover.props().isOpen).toBe(false);

      // @ts-ignore
      popover.props().toggle();

      const updatedIconPicker = updateIconPicker();

      expect(updatedIconPicker.find(UncontrolledPopover).props().isOpen).toBe(
        true
      );

      popover = updatedIconPicker.find(UncontrolledPopover);

      // @ts-ignore
      popover.props().toggle();

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
        // @ts-ignore
        .props().icon;
      expect(value).toBe('home');

      iconPickerParent.setProps({ value: undefined });

      expect(
        updateIconPicker()
          .find('#icon-picker-value')
          .exists()
      ).toBe(false);
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
        // @ts-ignore
        .props().icon;
      expect(value).toBe('home');
    });
  });
});
