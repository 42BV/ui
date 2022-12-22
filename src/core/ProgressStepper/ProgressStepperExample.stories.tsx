import React, { useState } from 'react';

import { ProgressStepper } from './ProgressStepper';
import { Card } from '../Card/Card';

type Step = 'Billing' | 'Coupon' | 'Finished';

type Status = 'complete' | 'incomplete' | 'error';

const steps: Step[] = ['Billing', 'Coupon', 'Finished'];

type ShoppingWizardState = { [x in Step]: Status };

const initialState: ShoppingWizardState = {
  ['Billing']: 'incomplete',
  ['Coupon']: 'incomplete',
  ['Finished']: 'incomplete'
};

export default {
  title: 'core/ProgressStepper',

  parameters: {
    component: ProgressStepper
  }
};

const ExampleStory = () => {
  const [status, setStatus] = useState<ShoppingWizardState>(initialState);
  const [current, setCurrent] = useState<Step>('Billing');

  function onSubmit() {
    // Add a random error chance
    if (Math.random() > 0.5) {
      setStatus({ ...status, [current]: 'Error' });
      return;
    }

    const currentIndex = steps.indexOf(current);
    const index = Math.min(steps.length - 1, currentIndex + 1);

    const nextStep = steps[index];

    setStatus({
      ...status,
      [current]: 'complete'
    });
    setCurrent(nextStep);
  }

  return (
    <Card>
      <div className="text-center">
        <ProgressStepper<Step>
          className="ms-auto"
          steps={steps}
          onClick={(step) => setCurrent(step)}
          isStepClickable={(step) => {
            // The current step is never clickable
            if (step === current) {
              return false;
            }

            return status[step] === 'complete';
          }}
          titleForStep={(step) => step}
          colorForStep={(step) => {
            const stepStatus = status[step];

            // Error status always wins from the current status.
            if (stepStatus === 'error') {
              return 'danger';
            }

            // When not in error and the step is the current step make it primary
            if (step === current) {
              return 'primary';
            }

            return stepStatus === 'complete' ? 'success' : 'secondary';
          }}
        />
      </div>
      <div className="ms-2">
        <h1>Form: {current}</h1>

        <button className="btn btn-primary" onClick={onSubmit}>
          Submit
        </button>

        <p>
          Press the &quot;Submit&quot; button to jump to the next stage. It will
          either succeed or fail randomly.
        </p>
      </div>
    </Card>
  );
};

export const Example = {
  render: ExampleStory,
  name: 'example'
};
