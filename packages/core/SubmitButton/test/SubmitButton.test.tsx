import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import SubmitButton, { Props } from '../src/SubmitButton';

describe('Component: SubmitButton', () => {
  let submitButton: ShallowWrapper;
  let onClickSpy: jest.Mock<any, any>;

  function setup(props?: Partial<Props>) {
    onClickSpy = jest.fn();

    submitButton = shallow(
      <SubmitButton onClick={onClickSpy} inProgress={true} {...props}>
        Submit
      </SubmitButton>
    );
  }

  describe('ui', () => {
    test('with all required props', () => {
      setup();

      expect(toJson(submitButton)).toMatchSnapshot(
        'Component: SubmitButton => ui => with all required props'
      );
    });

    test('with all optional params', () => {
      setup({ size: 'lg', className: 'extra-css-class' });

      expect(toJson(submitButton)).toMatchSnapshot(
        'Component: SubmitButton => ui => with all optional params'
      );
    });
  });

  describe('events', () => {
    it('should when the button is clicked call onClick', () => {
      setup();

      // @ts-ignore
      submitButton
        .find('Button')
        .props()
        .onClick();

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith();
    });
  });
});
