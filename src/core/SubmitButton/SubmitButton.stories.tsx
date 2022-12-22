import React from 'react';
import { action } from '@storybook/addon-actions';

import { SubmitButton } from './SubmitButton';

export default {
  title: 'core/buttons/SubmitButton',

  parameters: {
    component: SubmitButton
  }
};

const DefaultStory = () => {
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
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};

const SizeStory = () => {
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
};

export const Size = {
  render: SizeStory,
  name: 'size'
};
