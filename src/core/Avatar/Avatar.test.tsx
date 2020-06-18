import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import Avatar from './Avatar';
import { BootstrapSize } from '../types';
import Tooltip from '../Tooltip/Tooltip';

describe('Component: Avatar', () => {
  let avatar: ShallowWrapper;

  function setup({ size }: { size?: BootstrapSize }) {
    avatar = shallow(
      <Avatar
        className="red"
        size={size}
        src="http://lorempixel.com/200/200/"
        alt="A picture of a tomato"
      >
        <h1>Children</h1>
      </Avatar>
    );
  }

  describe('ui', () => {
    test('default size', () => {
      setup({ size: undefined });

      expect(toJson(avatar)).toMatchSnapshot(
        'Component: Avatar => ui => default size'
      );
    });

    test('xs size', () => {
      setup({ size: 'xs' });

      expect(avatar.find(Tooltip).props().distance).toBe(7);

      expect(
        avatar
          .find('span')
          .first()
          .props().className
      ).toBe('avatar avatar-xs red');
    });

    test('sm size', () => {
      setup({ size: 'sm' });

      expect(avatar.find(Tooltip).props().distance).toBe(22);

      expect(
        avatar
          .find('span')
          .first()
          .props().className
      ).toBe('avatar avatar-sm red');
    });

    test('md size', () => {
      setup({ size: 'md' });

      expect(avatar.find(Tooltip).props().distance).toBe(32);

      expect(
        avatar
          .find('span')
          .first()
          .props().className
      ).toBe('avatar avatar-md red');
    });

    test('lg size', () => {
      setup({ size: 'lg' });

      expect(avatar.find(Tooltip).props().distance).toBe(42);

      expect(
        avatar
          .find('span')
          .first()
          .props().className
      ).toBe('avatar avatar-lg red');
    });
  });
});
