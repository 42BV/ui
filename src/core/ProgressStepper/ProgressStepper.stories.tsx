import React from 'react';
import { action } from '@storybook/addon-actions';

import { ProgressStepper } from './ProgressStepper';
import { Card } from '../Card/Card';

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

export default {
  title: 'core/ProgressStepper',

  parameters: {
    component: ProgressStepper
  }
};

const ColorsStory = () => {
  return (
    <Card>
      <ProgressStepper<Step>
        steps={steps}
        onClick={action(`Clicked`)}
        isStepClickable={() => true}
        titleForStep={(step) => step}
        colorForStep={(step) => step}
      />
    </Card>
  );
};

export const Colors = {
  render: ColorsStory,
  name: 'colors'
};
