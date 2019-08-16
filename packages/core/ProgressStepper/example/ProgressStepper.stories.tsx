import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ProgressStepper from '../src/ProgressStepper';

enum Step {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger',
  LINK = 'link'
}

const steps: Step[] = [
  Step.PRIMARY,
  Step.SECONDARY,
  Step.SUCCESS,
  Step.INFO,
  Step.WARNING,
  Step.DANGER,
  Step.LINK
];

storiesOf('core|ProgressStepper', module)
  .addParameters({ component: ProgressStepper })
  .add('colors', () => {
    return (
      <div className="text-center">
        <ProgressStepper<Step>
          steps={steps}
          onClick={action(`Clicked`)}
          isStepClickable={() => true}
          titleForStep={step => step}
          colorForStep={step => step}
        />
      </div>
    );
  });
