import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import * as ShowAfter from '../../hooks/useShowAfter/useShowAfter';

import { LoadingPage } from './LoadingPage';

describe('Component: LoadingPage', () => {
  function setup({ show, height }: { show: boolean; height?: number }) {
    jest.spyOn(ShowAfter, 'useShowAfter').mockReturnValue(show);

    const { container } = render(<LoadingPage height={height} />);

    return { container };
  }

  describe('ui', () => {
    test('default', () => {
      const { container } = setup({ show: true });

      expect(container).toMatchSnapshot();
    });

    test('with no spinner because it is not after the timeout', () => {
      setup({ show: false });

      expect(screen.queryByRole('graphics-document')).not.toBeInTheDocument();
    });

    test('with custom height', () => {
      const { container } = setup({ show: true, height: 200 });

      expect(container).toMatchSnapshot();
    });
  });
});
