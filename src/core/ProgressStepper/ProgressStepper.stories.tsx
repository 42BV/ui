import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { ProgressStepper } from './ProgressStepper';

type Step =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'link';

const steps: Step[] = [
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'danger',
  'link'
];

storiesOf('core/ProgressStepper', module)
  .addParameters({ component: ProgressStepper })
  .add('colors', () => {
    return (
      <div className="text-center">
        <ProgressStepper<Step>
          steps={steps}
          onClick={action(`Clicked`)}
          isStepClickable={() => true}
          titleForStep={(step) => step}
          colorForStep={(step) => step}
        />
      </div>
    );
  });
