import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { ProgressStepper } from './ProgressStepper';

describe('Component: ProgressStepper', () => {
  test('ui', () => {
    const colorForStepSpy = jest.fn((_step, _index) => 'primary');
    const titleForStepSpy = jest.fn((step, _index) => step);

    const { container } = render(
      <ProgressStepper
        steps={['start']}
        // @ts-expect-error Test mock
        colorForStep={colorForStepSpy}
        titleForStep={titleForStepSpy}
        className="extra-css-class"
      />
    );

    expect(container).toMatchSnapshot();

    expect(colorForStepSpy).toHaveBeenCalledTimes(1);
    expect(colorForStepSpy).toHaveBeenCalledWith('start', 0);

    expect(titleForStepSpy).toHaveBeenCalledTimes(1);
    expect(titleForStepSpy).toHaveBeenCalledWith('start', 0);
  });

  describe('onClick', () => {
    it('should call onClick when isStepClickable returns true', () => {
      const onClickSpy = jest.fn();

      render(
        <ProgressStepper
          steps={['start', 'end']}
          colorForStep={() => 'primary'}
          titleForStep={(step) => step}
          // Only enable the first step.
          isStepClickable={(step, index) => index === 0}
          onClick={onClickSpy}
        />
      );

      fireEvent.click(screen.getByText('start'));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(onClickSpy).toHaveBeenCalledWith('start', 0);

      fireEvent.click(screen.getByText('end'));

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });
});
