import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Props, SubmitButton } from './SubmitButton';

import * as useScrollToClosestError from './useScrollToClosestError';

describe('Component: SubmitButton', () => {
  function setup(
    {
      hasOnClick = true,
      inProgress = false
    }: { hasOnClick: boolean; inProgress?: boolean },
    props?: Partial<Props>
  ) {
    const doScrollToClosestErrorSpy = jest.fn();

    jest
      .spyOn(useScrollToClosestError, 'useScrollToClosestError')
      .mockReturnValue({
        doScrollToClosestError: doScrollToClosestErrorSpy
      });

    const onClickSpy = jest.fn();

    const { container } = render(
      <SubmitButton
        onClick={hasOnClick ? onClickSpy : undefined}
        inProgress={inProgress}
        {...props}
      >
        Submit
      </SubmitButton>
    );

    expect(useScrollToClosestError.useScrollToClosestError).toBeCalledTimes(1);
    const enabled =
      props?.scrollToClosestError !== undefined
        ? props.scrollToClosestError
        : true;
    expect(useScrollToClosestError.useScrollToClosestError).toBeCalledWith({
      enabled
    });

    return { container, onClickSpy, doScrollToClosestErrorSpy };
  }

  describe('ui', () => {
    test('with all required props', () => {
      const { container } = setup({ hasOnClick: true });

      expect(container).toMatchSnapshot();
    });

    test('with all optional params', () => {
      const { container } = setup(
        {
          hasOnClick: true
        },
        {
          size: 'lg',
          className: 'extra-css-class',
          icon: '360'
        }
      );

      expect(container.firstChild).toHaveClass('extra-css-class');
      expect(screen.getByRole('button')).toHaveClass('btn-lg');
      expect(screen.queryByText('360')).toBeInTheDocument();
      expect(screen.queryByText('save')).not.toBeInTheDocument();
    });

    test('in progress', () => {
      const { container } = setup({ hasOnClick: true, inProgress: true });

      expect(container).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should when the button is clicked call onClick and scroll to closest error', () => {
      const { onClickSpy, doScrollToClosestErrorSpy } = setup({
        hasOnClick: true
      });

      fireEvent.click(screen.getByText('Submit'));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(doScrollToClosestErrorSpy).toBeCalledTimes(1);
    });

    it('should when the button is clicked even when there is no onClick scroll to closest error', () => {
      const { onClickSpy, doScrollToClosestErrorSpy } = setup({
        hasOnClick: false
      });

      fireEvent.click(screen.getByText('Submit'));

      expect(onClickSpy).toHaveBeenCalledTimes(0);
      expect(doScrollToClosestErrorSpy).toBeCalledTimes(1);
    });

    it('should when the button is clicked always call doScrollToClosestErrorSpy even when scrollToClosestError is false', () => {
      const { onClickSpy, doScrollToClosestErrorSpy } = setup(
        { hasOnClick: true },
        { scrollToClosestError: false }
      );

      fireEvent.click(screen.getByText('Submit'));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(doScrollToClosestErrorSpy).toBeCalledTimes(1);
    });
  });
});
