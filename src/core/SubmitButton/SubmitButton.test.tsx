import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

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
    const doScrollToClosestErrorSpy = vi.fn();

    vi.spyOn(
      useScrollToClosestError,
      'useScrollToClosestError'
    ).mockReturnValue({
      doScrollToClosestError: doScrollToClosestErrorSpy
    });

    const onClickSpy = vi.fn();

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

    test('with all optional params', async () => {
      expect.assertions(5);

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

      // @ts-expect-error HTMLElement has property classList
      expect(container.firstChild.classList.contains('extra-css-class')).toBe(
        true
      );
      expect(screen.getByRole('button').classList.contains('btn-lg')).toBe(
        true
      );
      await screen.findByText('360');
      expect(screen.queryByText('save')).toBeNull();
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
