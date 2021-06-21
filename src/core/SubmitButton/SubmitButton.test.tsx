import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import SubmitButton, { Props } from './SubmitButton';

import * as useScrollToClosestError from './useScrollToClosestError';

describe('Component: SubmitButton', () => {
  function setup(
    { hasOnClick = true }: { hasOnClick: boolean },
    props?: Partial<Props>
  ) {
    const doScrollToClosestErrorSpy = jest.fn();

    jest
      .spyOn(useScrollToClosestError, 'useScrollToClosestError')
      .mockImplementation(() => {
        return {
          doScrollToClosestError: doScrollToClosestErrorSpy
        };
      });

    const onClickSpy = jest.fn();

    const submitButton = shallow(
      <SubmitButton
        onClick={hasOnClick ? onClickSpy : undefined}
        inProgress={true}
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

    return { submitButton, onClickSpy, doScrollToClosestErrorSpy };
  }

  describe('ui', () => {
    test('with all required props', () => {
      const { submitButton } = setup({ hasOnClick: true });

      expect(toJson(submitButton)).toMatchSnapshot(
        'Component: SubmitButton => ui => with all required props'
      );
    });

    test('with all optional params', () => {
      const { submitButton } = setup(
        {
          hasOnClick: true
        },
        {
          size: 'lg',
          className: 'extra-css-class',
          icon: '360'
        }
      );

      expect(toJson(submitButton)).toMatchSnapshot(
        'Component: SubmitButton => ui => with all optional params'
      );
    });
  });

  describe('events', () => {
    it('should when the button is clicked call onClick and scroll to closest error', () => {
      const { submitButton, onClickSpy, doScrollToClosestErrorSpy } = setup({
        hasOnClick: true
      });

      const event = new Event('click');

      // @ts-expect-error Test mock
      submitButton.find('Button').props().onClick(event);

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(event);

      expect(doScrollToClosestErrorSpy).toBeCalledTimes(1);
    });

    it('should when the button is clicked even when there is no onClick scroll to closest error', () => {
      const { submitButton, onClickSpy, doScrollToClosestErrorSpy } = setup({
        hasOnClick: false
      });

      const event = new Event('click');

      // @ts-expect-error Test mock
      submitButton.find('Button').props().onClick(event);

      expect(onClickSpy).toHaveBeenCalledTimes(0);

      expect(doScrollToClosestErrorSpy).toBeCalledTimes(1);
    });

    it('should when the button is clicked always call doScrollToClosestErrorSpy even when scrollToClosestError is false', () => {
      const { submitButton, onClickSpy, doScrollToClosestErrorSpy } = setup(
        { hasOnClick: true },
        { scrollToClosestError: false }
      );

      const event = new Event('click');

      // @ts-expect-error Test mock
      submitButton.find('Button').props().onClick(event);

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith(event);

      expect(doScrollToClosestErrorSpy).toBeCalledTimes(1);
    });
  });
});
