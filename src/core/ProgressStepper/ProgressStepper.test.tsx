/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ProgressStepper from './ProgressStepper';

describe('Component: ProgressStepper', () => {
  test('ui', () => {
    const colorForStepSpy = jest.fn(() => 'primary');
    const titleForStepSpy = jest.fn(step => step);

    const progressStepper = shallow(
      <ProgressStepper
        steps={['start']}
        // @ts-ignore
        colorForStep={colorForStepSpy}
        titleForStep={titleForStepSpy}
        className="extra-css-class"
      />
    );

    expect(toJson(progressStepper)).toMatchSnapshot();

    expect(colorForStepSpy).toBeCalledTimes(1);
    expect(colorForStepSpy).toHaveBeenCalledWith('start', 0);

    expect(titleForStepSpy).toBeCalledTimes(1);
    expect(titleForStepSpy).toHaveBeenCalledWith('start', 0);
  });

  describe('onClick', () => {
    it('should call onClick when isStepClickable returns true', () => {
      const onClickSpy = jest.fn();

      const progressStepper = shallow(
        <ProgressStepper
          steps={['start', 'end']}
          colorForStep={() => 'primary'}
          titleForStep={() => 'start'}
          // Only enable the first step.
          isStepClickable={(step, index) => index === 0}
          onClick={onClickSpy}
        />
      );

      // Test if 'start' is indeed enabled.
      progressStepper
        .find('.step-item')
        .at(0)
        .simulate('click');

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith('start', 0);

      // Test if 'end' is indeed disabled.
      progressStepper
        .find('.step-item')
        .at(1)
        .simulate('click');
      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });
});
