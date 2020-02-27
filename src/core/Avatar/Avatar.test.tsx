import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import Avatar from './Avatar';
import { BootstrapSize } from '../types';

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

    test('non default size', () => {
      setup({ size: 'xs' });

      expect(
        avatar
          .find('span')
          .first()
          .props().className
      ).toContain('avatar-xs');
    });
  });
});
