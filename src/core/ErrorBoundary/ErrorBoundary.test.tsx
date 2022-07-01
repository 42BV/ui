import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ErrorBoundary } from './ErrorBoundary';

describe('Component: ErrorBoundary', () => {
  describe('ui', () => {
    test('without error', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        // Do nothing, we only want to make sure the error is logged
      });

      const { container } = render(
        <ErrorBoundary>
          Here is some content without an error
        </ErrorBoundary>
      );

      expect(screen.queryByText('Oops something went wrong!')).not.toBeInTheDocument();
      expect(screen.queryByText('Here is some content without an error')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
    });

    test('with error', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        // Do nothing, we only want to make sure the error is logged
      });

      const error = new Error('bad');

      const Throw = () => {
        throw error;
      };

      const { container } = render(
        <ErrorBoundary>
          <Throw />
        </ErrorBoundary>
      );

      expect(screen.queryByText('Oops something went wrong!')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
      expect(consoleErrorSpy).toHaveBeenCalledTimes(4);
    });

    test('with custom text', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {
        // Do nothing, we only want to make sure the error is logged
      });

      const Throw = () => {
        throw new Error('bad');
      };

      render(
        <ErrorBoundary text={{error: 'Something terrible happened!'}}>
          <Throw />
        </ErrorBoundary>
      );

      expect(screen.queryByText('Oops something went wrong!')).not.toBeInTheDocument();
      expect(screen.queryByText('Something terrible happened!')).toBeInTheDocument();
    });
  });
});
