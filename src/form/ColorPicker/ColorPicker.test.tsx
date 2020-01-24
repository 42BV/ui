import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ColorPicker from './ColorPicker';
import { UncontrolledPopover, Button } from 'reactstrap';
import { SketchPicker } from 'react-color';

describe('Component: ColorPicker', () => {
  function setup({ value }: { value?: string }) {
    const onChangeSpy = jest.fn();
    const onBlurSpy = jest.fn();

    const props = {
      id: 'bestFriend',
      name: 'bestFriend',
      label: 'Best Friend',
      placeholder: 'Select your best friend',
      value,
      onChange: onChangeSpy,
      onBlur: onBlurSpy,
      error: 'Some error',
      color: 'success'
    };

    // @ts-ignore
    const colorPicker = shallow(<ColorPicker {...props} />);

    return {
      colorPicker,
      onBlurSpy,
      onChangeSpy
    };
  }

  describe('ui', () => {
    test('with selected value', () => {
      const { colorPicker } = setup({ value: '#cdcdcd' });

      expect(toJson(colorPicker)).toMatchSnapshot();
    });

    test('without selected value', () => {
      const { colorPicker } = setup({ value: undefined });

      expect(toJson(colorPicker)).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should open the popover when the select button is clicked', () => {
      const { colorPicker } = setup({
        value: undefined
      });

      const popover = colorPicker.find(UncontrolledPopover);

      expect(popover.props().isOpen).toBe(false);

      // Check that the target is the same.
      expect(popover.props().target).toBe('color-picker-popover');
      expect(
        colorPicker
          .find(Button)
          .at(0)
          .props().id
      ).toBe('color-picker-popover');

      // @ts-ignore
      popover.props().toggle();

      expect(colorPicker.find(UncontrolledPopover).props().isOpen).toBe(true);
    });

    it('should when the user selects a color close the popover and call onChange', () => {
      const { colorPicker, onChangeSpy, onBlurSpy } = setup({
        value: undefined
      });

      // @ts-ignore
      colorPicker
        .find(SketchPicker)
        .at(0)
        .props()
        //@ts-ignore
        .onChange({ hex: '#424242' });

      //@ts-ignore
      colorPicker
        .find(Button)
        .at(2)
        .props()
        // @ts-ignore
        .onClick();

      expect(colorPicker.find(UncontrolledPopover).props().isOpen).toBe(false);

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('#424242');

      expect(onBlurSpy).toHaveBeenCalledTimes(1);

      //@ts-ignore
      const color = colorPicker
        .find(SketchPicker)
        .at(0)
        .props().color;

      expect(color).toBe('#424242');
    });

    describe('cancel behavior', () => {
      it('should when cancelled when a previous value has een selected: close the popover, not call onChange, and reset to the old value', () => {
        const { colorPicker, onChangeSpy, onBlurSpy } = setup({
          value: '#cdcdcd'
        });

        // @ts-ignore
        colorPicker
          .find(SketchPicker)
          .at(0)
          .props()
          //@ts-ignore
          .onChange({ hex: '#424242' });

        //@ts-ignore
        colorPicker
          .find(Button)
          .at(1)
          .props()
          // @ts-ignore
          .onClick();

        expect(colorPicker.find(UncontrolledPopover).props().isOpen).toBe(
          false
        );

        expect(onChangeSpy).toHaveBeenCalledTimes(0);
        expect(onBlurSpy).toHaveBeenCalledTimes(0);

        //@ts-ignore
        const color = colorPicker
          .find(SketchPicker)
          .at(0)
          .props().color;

        expect(color).toBe('#cdcdcd');
      });

      it('should when cancelled when a previous value was not selected: close the popover, not call onChange, and reset to white', () => {
        const { colorPicker, onChangeSpy, onBlurSpy } = setup({
          value: undefined
        });

        // @ts-ignore
        colorPicker
          .find(SketchPicker)
          .at(0)
          .props()
          //@ts-ignore
          .onChange({ hex: '#424242' });

        //@ts-ignore
        colorPicker
          .find(Button)
          .at(1)
          .props()
          // @ts-ignore
          .onClick();

        expect(colorPicker.find(UncontrolledPopover).props().isOpen).toBe(
          false
        );

        expect(onChangeSpy).toHaveBeenCalledTimes(0);
        expect(onBlurSpy).toHaveBeenCalledTimes(0);

        //@ts-ignore
        const color = colorPicker
          .find(SketchPicker)
          .at(0)
          .props().color;

        expect(color).toBe('#ffffff');
      });
    });

    it('should when the user clicks "clear" reset the color', () => {
      const { colorPicker, onBlurSpy, onChangeSpy } = setup({
        value: '#cdcdcd'
      });

      // @ts-ignore
      colorPicker
        .find('u')
        .props()
        // @ts-ignore
        .onClick();

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(undefined);

      expect(onBlurSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('value changes', () => {
    test('becomes empty', () => {
      const { colorPicker } = setup({
        value: '#cdcdcd'
      });

      const value = colorPicker
        .find('#color-picker-value')
        // @ts-ignore
        .props().style?.backgroundColor;
      expect(value).toBe('#cdcdcd');

      colorPicker.setProps({ value: undefined });

      expect(colorPicker.find('#color-picker-value').exists()).toBe(false);
    });

    test('becomes filled', () => {
      const { colorPicker } = setup({
        value: undefined
      });

      expect(colorPicker.find('#color-picker-value').exists()).toBe(false);

      colorPicker.setProps({
        value: '#cdcdcd'
      });

      const value = colorPicker
        .find('#color-picker-value')
        // @ts-ignore
        .props().style?.backgroundColor;
      expect(value).toBe('#cdcdcd');
    });
  });
});