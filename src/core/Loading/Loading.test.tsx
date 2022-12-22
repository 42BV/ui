import React from 'react';
import { render, screen } from '@testing-library/react';

import { Loading } from './Loading';

describe('Component: Loading', () => {
  describe('ui', () => {
    test('without children', () => {
      const { container } = render(<Loading />);

      expect(container).toMatchSnapshot();
    });

    test('with children', async () => {
      expect.assertions(1);

      render(
        <Loading>
          <b>We are loading the world!</b>
        </Loading>
      );

      expect(screen.queryByText('Loading...')).toBeNull();
      await screen.findByText('We are loading the world!');
    });
  });
});
