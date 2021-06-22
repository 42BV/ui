import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { AsyncActionButton } from './AsyncActionButton';
import { rejectablePromise, resolvablePromise } from '../../test/utils';

describe('Component: AsyncActionButton', () => {
  function setup({ promise }: { promise: Promise<any> }) {
    const actionSpy = jest.fn().mockReturnValue(promise);

    const props = {
      action: actionSpy,
      children: 'Resend confirmation'
    };

    const asyncActionButton = shallow(
      <AsyncActionButton {...props}>Resend confirmation</AsyncActionButton>
    );

    return { asyncActionButton, actionSpy };
  }

  describe('ui', () => {
    test('not in progress', () => {
      const { promise } = resolvablePromise();
      const { asyncActionButton } = setup({ promise });

      expect(toJson(asyncActionButton)).toMatchSnapshot(
        'Component: AsyncActionButton => ui => not in progess'
      );
    });

    test('in progress', () => {
      const { promise } = resolvablePromise();
      const { asyncActionButton } = setup({ promise });

      // @ts-expect-error Test mock
      asyncActionButton
        .find('Button')
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(toJson(asyncActionButton)).toMatchSnapshot(
        'Component: AsyncActionButton => ui => in progress'
      );
    });
  });

  describe('events', () => {
    it('should be in progress when the AsyncActionButton button is clicked', () => {
      const { promise } = resolvablePromise();
      const { asyncActionButton } = setup({ promise });

      // @ts-expect-error Test mock
      asyncActionButton
        .find('Button')
        .props()
        // @ts-expect-error Test mock
        .onClick();

      // @ts-expect-error Test mock
      expect(asyncActionButton.find('Button').props().inProgress).toBe(true);
    });

    it('should trigger action when the AsyncActionButton button is clicked', () => {
      const { promise } = resolvablePromise();
      const { asyncActionButton, actionSpy } = setup({ promise });

      // @ts-expect-error Test mock
      asyncActionButton
        .find('Button')
        .props()
        // @ts-expect-error Test mock
        .onClick();

      expect(actionSpy).toHaveBeenCalledTimes(1);
    });

    it('should set inProgress to false when promise is resolved', async () => {
      expect.assertions(1);

      const { promise, resolve } = resolvablePromise();
      const { asyncActionButton } = setup({ promise });

      // @ts-expect-error Test mock
      asyncActionButton
        .find('Button')
        .props()
        // @ts-expect-error Test mock
        .onClick();

     
        await resolve();

        // @ts-expect-error Test mock
        expect(asyncActionButton.find('Button').props().inProgress).toBe(false);

     
    });

    it('should call onError and set inProgress to false when promise is rejected', async () => {
      expect.assertions(1);

      const { promise, reject } = rejectablePromise();
      const { asyncActionButton } = setup({ promise });

      // @ts-expect-error Test mock
      asyncActionButton
        .find('Button')
        .props()
        // @ts-expect-error Test mock
        .onClick();

     
        await reject('test rejection reason');

        // @ts-expect-error Test mock
        expect(asyncActionButton.find('Button').props().inProgress).toBe(false);

    });
  });
});
