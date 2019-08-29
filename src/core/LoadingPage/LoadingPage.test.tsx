/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import LoadingPage from './LoadingPage';

describe('Component: LoadingPage', () => {
  let container: HTMLElement;

  beforeEach(() => {
    jest.useFakeTimers();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    // @ts-ignore
    container = null;
  });

  it('should render loading page and show the spinner after 200 milliseconds', () => {
    act(() => {
      ReactDOM.render(<LoadingPage />, container);
    });

    expect(container.querySelector('svg')).toBe(null);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(container.querySelector('svg')).not.toBe(null);
  });

  it('should when unmounting cancel the timeout', () => {
    jest.spyOn(window, 'setTimeout');
    jest.spyOn(window, 'clearTimeout');

    act(() => {
      ReactDOM.render(<LoadingPage />, container);
    });

    ReactDOM.unmountComponentAtNode(container);

    expect(window.clearTimeout).toHaveBeenCalledTimes(1);
  });
});
