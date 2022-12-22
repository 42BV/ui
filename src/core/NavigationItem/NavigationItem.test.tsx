import React from 'react';
import { render, screen } from '@testing-library/react';

import { NavigationItem } from './NavigationItem';
import { Navigator, Router } from 'react-router-dom';

describe('Component: NavigationItem', () => {
  function setup({
    show,
    className,
    location = 'test'
  }: {
    show?: (() => boolean) | boolean;
    className?: string;
    location?: string;
  }) {
    // @ts-expect-error Test mock
    const navigator: Navigator = {
      createHref: (to: string) => to
    };

    const { container } = render(
      <Router location={location} navigator={navigator}>
        <NavigationItem
          to="/dashboard"
          icon="dashboard"
          text="Dashboard"
          show={show}
          className={className}
        />
      </Router>
    );

    return { container };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({});
      expect(container).toMatchSnapshot();
    });

    test('active', () => {
      setup({ location: '/dashboard' });
      expect(
        // @ts-expect-error HTMLElement has property classList
        screen.getByText('dashboard').parentNode?.classList.contains('active')
      ).toBe(true);
    });

    test('extra class', () => {
      const { container } = setup({ className: 'extra-class' });
      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('extra-class')).toBe(true);
    });
  });

  describe('show behavior', () => {
    it('should not render when show is false', () => {
      setup({ show: false });
      expect(screen.queryByText('dashboard')).toBeNull();
    });

    it('should render when predicate resolves to true', async () => {
      expect.assertions(0);
      setup({ show: () => 1 + 1 === 2 });
      await screen.findByText('dashboard');
    });

    it('should not render when predicate resolves to false', () => {
      setup({ show: () => 1 + 2 === 2 });
      expect(screen.queryByText('dashboard')).toBeNull();
    });

    it('should default show to true if it is not provided', async () => {
      expect.assertions(0);
      setup({});
      await screen.queryByText('dashboard');
    });
  });
});
