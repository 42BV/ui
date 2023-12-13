import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

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
      expect(screen.getByText('dashboard').parentNode).toHaveClass('active');
    });

    test('extra class', () => {
      const { container } = setup({ className: 'extra-class' });
      expect(container.firstChild).toHaveClass('extra-class');
    });
  });

  describe('show behavior', () => {
    it('should not render when show is false', () => {
      setup({ show: false });
      expect(screen.queryByText('dashboard')).not.toBeInTheDocument();
    });

    it('should render when predicate resolves to true', () => {
      setup({ show: () => 1 + 1 === 2 });
      expect(screen.queryByText('dashboard')).toBeInTheDocument();
    });

    it('should not render when predicate resolves to false', () => {
      setup({ show: () => 1 + 2 === 2 });
      expect(screen.queryByText('dashboard')).not.toBeInTheDocument();
    });

    it('should default show to true if it is not provided', () => {
      setup({});
      expect(screen.queryByText('dashboard')).toBeInTheDocument();
    });
  });
});
