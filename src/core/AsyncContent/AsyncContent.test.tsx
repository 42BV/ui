import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import AsyncContent from './AsyncContent';

type State = {
  isLoading: boolean;
  isFulfilled?: boolean;
  data?: string;
  error?: string;
  reload: () => void;
};

describe('Component: AsyncContent', () => {
  function setup({
    state,
    showRetryButton = undefined
  }: {
    state: State;
    showRetryButton?: boolean;
  }) {
    jest.spyOn(console, 'error');

    const asyncContent = shallow(
      // @ts-ignore
      <AsyncContent state={state} showRetryButton={showRetryButton}>
        {(data: string) => <h2>{data}</h2>}
      </AsyncContent>
    );

    return { asyncContent };
  }

  test('when loading', () => {
    const state = {
      isLoading: true,
      reload: () => undefined
    };

    const { asyncContent } = setup({ state });
    expect(toJson(asyncContent)).toMatchSnapshot();
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  test('when fulfilled', () => {
    const state = {
      isLoading: false,
      isFulfilled: true,
      data: 'importantos data',
      reload: () => undefined
    };

    const { asyncContent } = setup({ state });

    expect(toJson(asyncContent)).toMatchSnapshot();
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  describe('when rejected', () => {
    test('with retry button', () => {
      const reloadSpy = jest.fn();

      jest.spyOn(console, 'error');
      const state = {
        isLoading: false,
        isFulfilled: false,
        error: 'something error',
        reload: reloadSpy
      };

      const { asyncContent } = setup({ state, showRetryButton: true });

      expect(toJson(asyncContent)).toMatchSnapshot();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('something error');

      asyncContent.find('Button').simulate('click');

      expect(reloadSpy).toHaveBeenCalledTimes(1);
    });

    test('without retry button', () => {
      jest.spyOn(console, 'error');
      const state = {
        isLoading: false,
        isFulfilled: false,
        error: 'something error',
        reload: () => undefined
      };

      const { asyncContent } = setup({ state, showRetryButton: false });

      expect(toJson(asyncContent)).toMatchSnapshot();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('something error');
    });

    test('should not render when showRetryButton is undefined', () => {
      const reloadSpy = jest.fn();

      jest.spyOn(console, 'error');
      const state = {
        isLoading: false,
        isFulfilled: false,
        error: 'something error',
        reload: reloadSpy
      };

      const { asyncContent } = setup({ state });

      expect(toJson(asyncContent)).toMatchSnapshot();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('something error');
    });
  });
});
