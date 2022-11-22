import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Loading } from './Loading';

describe('Component: Loading', () => {
  describe('ui', () => {
    test('without children', () => {
      const { container } = render(<Loading />);

      expect(container).toMatchSnapshot();
    });

    test('with children', () => {
      render(
        <Loading>
          <b>We are loading the world!</b>
        </Loading>
      );

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(
        screen.queryByText('We are loading the world!')
      ).toBeInTheDocument();
    });
  });
});
