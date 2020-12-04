import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';

import SubmitButton, { Props } from './SubmitButton';

describe('Component: SubmitButton', () => {
  let submitButton: ShallowWrapper;
  let onClickSpy: jest.Mock;

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
      submitButton.find('Button').simulate('click');

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith();
    });
  });
});
