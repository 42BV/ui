import React from 'react';
import { render } from '@testing-library/react';

import { Avatar } from './Avatar';
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
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('avatar')).toBe(true);
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('avatar-xs')).toBe(false);
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('avatar-sm')).toBe(false);
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('avatar-md')).toBe(false);
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('avatar-lg')).toBe(false);
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('red')).toBe(true);
    });

    test('xs size', () => {
      const { container } = setup({ size: 'xs' });
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('avatar-xs')).toBe(true);
    });

    test('sm size', () => {
      const { container } = setup({ size: 'sm' });
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('avatar-sm')).toBe(true);
    });

    test('md size', () => {
      const { container } = setup({ size: 'md' });
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('avatar-md')).toBe(true);
    });

    test('lg size', () => {
      const { container } = setup({ size: 'lg' });
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('avatar-lg')).toBe(true);
    });
  });
});
