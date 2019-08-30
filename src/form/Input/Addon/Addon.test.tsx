import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import Addon from './Addon';
import Icon from '../../../core/Icon/Icon';

describe('Component: Addon', () => {
  describe('ui', () => {
    it('should accept an icon', () => {
      const addon = shallow(<Addon icon="face" position="right" />);

      expect(toJson(addon)).toMatchSnapshot('Component: Addon with icon');
      expect(
        addon.find('Button').containsMatchingElement(<Icon icon="face" />)
      ).toBe(true);
    });

    it('should accept text', () => {
      const addon = shallow(
        <Addon text="bitcoin" color="danger" position="left" />
      );

      expect(toJson(addon)).toMatchSnapshot('Component: Addon with text');
      expect(addon.find('Button').contains('bitcoin')).toBe(true);
    });
  });

  describe('position behavior', () => {
    it('should use addonType "append" when right', () => {
      const addon = shallow(
        <Addon icon="face" color="success" position="right" />
      );

      // @ts-ignore
      expect(addon.find('InputGroupAddon').props().addonType).toBe('append');
    });

    it('should use addonType "prepend" when left', () => {
      const addon = shallow(
        <Addon icon="face" color="danger" position="left" />
      );

      // @ts-ignore
      expect(addon.find('InputGroupAddon').props().addonType).toBe('prepend');
    });
  });

  describe('color behavior', () => {
    it('should show a primary button when color is empty', () => {
      const addon = shallow(<Addon icon="face" position="right" />);

      expect(addon.find('Button').props().color).toBe('primary');
    });

    it('should show a danger button when color is danger', () => {
      const addon = shallow(
        <Addon icon="face" color="danger" position="left" />
      );

      expect(addon.find('Button').props().color).toBe('danger');
    });

    it('should show a danger button when color is danger', () => {
      const addon = shallow(
        <Addon icon="face" color="danger" position="left" />
      );

      expect(addon.find('Button').props().color).toBe('danger');
    });
  });

  describe('onClick behavior', () => {
    it('should when onClick is defined make it clickable', () => {
      const onClickSpy = jest.fn();

      const addon = shallow(
        <Addon icon="face" position="right" onClick={onClickSpy} />
      );

      const button = addon.find('Button');

      expect(button.props().className).toBe('clickable');

      button.simulate('click');

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('should when onClick is not defined make it not-clickable', () => {
      const addon = shallow(
        <Addon icon="face" position="left" onClick={undefined} />
      );

      const button = addon.find('Button');

      expect(button.props().className).toBe('not-clickable');
    });
  });
});
