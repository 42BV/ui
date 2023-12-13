import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { SubmitButton } from './SubmitButton';

storiesOf('core/buttons/SubmitButton', module)
  .addParameters({ component: SubmitButton })
  .add('default', () => {
    return (
      <div className="text-center">
        <p>When not in progress:</p>
        <SubmitButton onClick={() => action('on submit')} inProgress={false}>
          Save
        </SubmitButton>

        <hr />

        <p>When in progress:</p>
        <SubmitButton onClick={() => action('on submit')} inProgress={true}>
          Save
        </SubmitButton>
      </div>
    );
  })
  .add('size', () => {
    return (
      <div>
        <SubmitButton
          onClick={() => action('on submit')}
          inProgress={false}
          size="sm"
        >
          sm
        </SubmitButton>

        <SubmitButton
          onClick={() => action('on submit')}
          inProgress={false}
          size="md"
        >
          default (md)
        </SubmitButton>

        <SubmitButton
          onClick={() => action('on submit')}
          inProgress={false}
          size="lg"
        >
          lg
        </SubmitButton>
      </div>
    );
  });
