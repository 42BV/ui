import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { ProgressStepper } from './ProgressStepper';
import { Card } from '../../card/Card/Card';

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
  });
