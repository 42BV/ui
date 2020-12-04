import React from 'react';
import classNames from 'classnames';
import { Color } from '../types';

type Props<T> = {
  /**
   * The steps that the progress stepper needs to render. Can be
   * anything from an array of strings to an array of complex
   * objects.
   */
  steps: T[];

  /**
   * Optional callback which is called when the step is clicked.
   *
   * Can only be called if the `isStepClickable` for this step
   * returns `true`.
   *
   * @param {T} step The step which is clicked
   * @param {number} index The index of the step that was clicked
   */
  onClick?(step: T, index: number): void;

  /**
   * Callback to determine the bootstrap color of the step.
   *
   * The color also determines if an icon is shown in the circle
   * or a number.
   *
   * @param {T} step The step you must provide the color for
   * @param {number} index The index of the step you must provide the color for\
   * @returns {Color}
   */
  colorForStep(step: T, index: number): Color;

  /**
   * Callback to determine the title for the step to display below the circle.
   *
   * @param {T} step The step you must provide the title for
   * @param {number} index The index of the step you must provide the color for
   * @returns {string} The title of the step
   */
  titleForStep(step: T, index: number): string;

  /**
   * Optional callback to determine whether or not the step is clickable.
   *
   * When the step is clickable the cursor will be a pointer, and
   * calls to `onClick` are let through.
   *
   * @param {T} step The step you must answer whether it is clickable or not
   * @param {number} index The index of the step for which you must answer whether it is clickable or not
   * @returns {boolean} Whether or not the step is clickable
   */
  isStepClickable?(step: T, index: number): boolean;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
};

const alwaysFalse = () => false;

export default function ProgressStepper<T>(props: Props<T>) {
  const {
    steps,
    onClick,
    colorForStep,
    titleForStep,
    isStepClickable = alwaysFalse,
    className
  } = props;

  return (
    <div className={classNames('progress-stepper', className)}>
      {steps.map((step, index) => {
        const title = titleForStep(step, index);
        const color = colorForStep(step, index);
        const clickable = isStepClickable(step, index);
        const classes = classNames('step', color, { clickable });

        return (
          <div key={title} className={classes}>
            <div
              className="step-item"
              onClick={() => {
                if (clickable && onClick) {
                  onClick(step, index);
                }
              }}
            >
              <div className="step-circle">
                <span>{index + 1}</span>
              </div>

              <div className="step-title">{title}</div>
            </div>
            <div className="step-bar-left" />
            <div className="step-bar-right" />
          </div>
        );
      })}
    </div>
  );
}
