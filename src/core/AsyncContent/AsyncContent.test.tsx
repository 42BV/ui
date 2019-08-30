import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import AsyncContent from './AsyncContent';

describe('Component: AsyncContent', () => {
  function setup(state: {
    isLoading: boolean;
    isFulfilled?: boolean;
    data?: string;
    error?: string;
  }) {
    jest.spyOn(console, 'error');

    const asyncContent = shallow(
      // @ts-ignore
      <AsyncContent state={state}>{data => <h2>{data}</h2>}</AsyncContent>
    );

    return { asyncContent };
  }

  test('when loading', () => {
    const state = {
      isLoading: true
    };

    const { asyncContent } = setup(state);

    expect(toJson(asyncContent)).toMatchSnapshot();
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  test('when fulfilled', () => {
    const state = {
      isLoading: false,
      isFulfilled: true,
      data: 'importantos data'
    };

    const { asyncContent } = setup(state);

    expect(toJson(asyncContent)).toMatchSnapshot();
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  test('when rejected', () => {
    jest.spyOn(console, 'error');
    const state = {
      isLoading: false,
      isFulfilled: false,
      error: 'something error'
    };

    const { asyncContent } = setup(state);

    expect(toJson(asyncContent)).toMatchSnapshot();
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith('something error');
  });
});
