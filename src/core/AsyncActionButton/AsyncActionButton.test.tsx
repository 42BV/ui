import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { AsyncActionButton } from './AsyncActionButton';
import { rejectablePromise, resolvablePromise } from '../../test/utils';

describe('Component: AsyncActionButton', () => {
  function setup({ promise }: { promise: Promise<any> }) {
    const actionSpy = jest.fn().mockReturnValue(promise);

    const props = {
      action: actionSpy,
      children: 'Resend confirmation'
    };

    const { container } = render(
      <AsyncActionButton {...props}>Resend confirmation</AsyncActionButton>
    );

    return { container, actionSpy };
  }

  describe('ui', () => {
    test('not in progress', () => {
      const { promise } = resolvablePromise();
      const { container } = setup({ promise });

      expect(container).toMatchSnapshot();
    });

    test('in progress', () => {
      const { promise } = resolvablePromise();
      const { container } = setup({ promise });

      fireEvent.click(screen.getByText('Resend confirmation'));

      expect(container).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should be in progress when the AsyncActionButton button is clicked', () => {
      expect.assertions(1);
      const { promise } = resolvablePromise();
      const { container } = setup({ promise });

      fireEvent.click(screen.getByText('Resend confirmation'));

      expect(container).toMatchSnapshot();
    });

    it('should trigger action when the AsyncActionButton button is clicked', () => {
      const { promise } = resolvablePromise();
      const { actionSpy } = setup({ promise });

      fireEvent.click(screen.getByText('Resend confirmation'));

      expect(actionSpy).toHaveBeenCalledTimes(1);
    });

    it('should set inProgress to false when promise is resolved', async () => {
      expect.assertions(1);

      const { promise, resolve } = resolvablePromise();
      const { container } = setup({ promise });

      fireEvent.click(screen.getByText('Resend confirmation'));

      await act(async () => {
        await resolve();
      });

      expect(container).toMatchSnapshot();
    });

    it('should call onError and set inProgress to false when promise is rejected', async () => {
      expect.assertions(1);

      const { promise, reject } = rejectablePromise();
      const { container } = setup({ promise });

      fireEvent.click(screen.getByText('Resend confirmation'));

      await act(async () => {
        await reject('test rejection reason');
      });

      expect(container).toMatchSnapshot();
    });
  });
});
