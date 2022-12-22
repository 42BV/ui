import React from 'react';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ErrorBoundary } from './ErrorBoundary';

describe('Component: ErrorBoundary', () => {
  describe('ui', () => {
    test('without error', async () => {
      expect.assertions(3);

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {
          // Do nothing, we only want to make sure the error is logged
        });

      const { container } = render(
        <ErrorBoundary>Here is some content without an error</ErrorBoundary>
      );

      expect(screen.queryByText('Oops something went wrong!')).toBeNull();
      await screen.findByText('Here is some content without an error');
      expect(container).toMatchSnapshot();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
    });

    test('with error', async () => {
      expect.assertions(2);

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      const error = new Error('bad');

      const Throw = () => {
        throw error;
      };

      const { container } = render(
        <ErrorBoundary>
          <Throw />
        </ErrorBoundary>
      );

      await screen.queryByText('Oops something went wrong!');
      expect(container).toMatchSnapshot();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    });

    test('with custom text', async () => {
      expect.assertions(1);

      vi.spyOn(console, 'error').mockImplementation(() => {
        // Do nothing, we only want to make sure the error is logged
      });

      const Throw = () => {
        throw new Error('bad');
      };

      render(
        <ErrorBoundary text={{ error: 'Something terrible happened!' }}>
          <Throw />
        </ErrorBoundary>
      );

      expect(screen.queryByText('Oops something went wrong!')).toBeNull();
      await screen.findByText('Something terrible happened!');
    });
  });
});
