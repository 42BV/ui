import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import Avatar from './Avatar';
import { BootstrapSize } from '../types';

describe('Component: Avatar', () => {
  function setup({ size }: { size?: BootstrapSize }) {
    const { container } = render(
      <Avatar
        className="red"
        size={size}
        src="http://lorempixel.com/200/200/"
        alt="A picture of a tomato"
      >
        <h1>Children</h1>
      </Avatar>
    );
    
    return { container };
  }

  describe('ui', () => {
    test('default size', () => {
      const { container } = setup({ size: undefined });

      expect(container).toMatchSnapshot();
    });

    test('xs size', () => {
      const { container } = setup({ size: 'xs' });

      expect(container).toMatchSnapshot();
      expect(container.firstChild).toHaveClass('avatar avatar-xs red');
    });

    test('sm size', () => {
      const { container } = setup({ size: 'sm' });

      expect(container).toMatchSnapshot();
      expect(container.firstChild).toHaveClass('avatar avatar-sm red');
    });

    test('md size', () => {
      const { container } = setup({ size: 'md' });

      expect(container).toMatchSnapshot();
      expect(container.firstChild).toHaveClass('avatar avatar-md red');
    });

    test('lg size', () => {
      const { container } = setup({ size: 'lg' });

      expect(container).toMatchSnapshot();
      expect(container.firstChild).toHaveClass('avatar avatar-lg red');
    });
  });
});
