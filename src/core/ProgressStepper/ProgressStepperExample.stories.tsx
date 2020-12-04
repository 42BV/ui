import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import ProgressStepper from './ProgressStepper';

enum Step {
  BILLING = 'Billing',
  COUPON = 'Coupon',
  FINISHED = 'Finished'
}

export enum Status {
  COMPLETE = 'complete',
  INCOMPLETE = 'incomplete',
  ERROR = 'error'
}

const steps = [Step.BILLING, Step.COUPON, Step.FINISHED];

type ShoppingWizardState = { [x in Step]: Status };

const initialState: ShoppingWizardState = {
  [Step.BILLING]: Status.INCOMPLETE,
  [Step.COUPON]: Status.INCOMPLETE,
  [Step.FINISHED]: Status.INCOMPLETE
};

storiesOf('core/ProgressStepper', module)
  .addParameters({ component: ProgressStepper })
  .add('example', () => {
    const [status, setStatus] = useState<ShoppingWizardState>(initialState);
    const [current, setCurrent] = useState(Step.BILLING);

    function onSubmit() {
      // Add a random error chance
      if (Math.random() > 0.5) {
        setStatus({ ...status, [current]: Status.ERROR });
        return;
      }

      const currentIndex = steps.indexOf(current);
      const index = Math.min(steps.length - 1, currentIndex + 1);

      const nextStep = steps[index];

      setStatus({
        ...status,
        [current]: Status.COMPLETE
      });
      setCurrent(nextStep);
    }

    return (
      <>
        <div className="text-center">
          <ProgressStepper<Step>
            className="ml-auto"
            steps={steps}
            onClick={(step) => setCurrent(step)}
            isStepClickable={(step) => {
              // The current step is never clickable
              if (step === current) {
                return false;
              }

              return status[step] === Status.COMPLETE;
            }}
            titleForStep={(step) => step}
            colorForStep={(step) => {
              const stepStatus = status[step];

              // Error status always wins from the current status.
              if (stepStatus === Status.ERROR) {
                return 'danger';
              }

              // When not in error and the step is the current step make it primary
              if (step === current) {
                return 'primary';
              }

              return stepStatus === Status.COMPLETE ? 'success' : 'secondary';
            }}
          />
        </div>
        <div className="ml-2">
          <h1>Form: {current}</h1>

          <button className="btn btn-primary" onClick={onSubmit}>
            Submit
          </button>

          <p>
            Press the &quot;Submit&quot; button to jump to the next stage. It
            will either succeed or fail randomly.
          </p>
        </div>
      </>
    );
  });
