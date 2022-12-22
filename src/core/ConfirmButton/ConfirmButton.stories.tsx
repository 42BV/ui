import React from 'react';
import { action } from '@storybook/addon-actions';

import { ConfirmButton } from './ConfirmButton';

export default {
  title: 'core/buttons/ConfirmButton',

  parameters: {
    component: ConfirmButton
  }
};

const AsButtonStory = () => {
  return (
    <div className="text-center">
      <p>When not in progress:</p>
      <ConfirmButton
        onConfirm={action('Accept clicked')}
        dialogText={
          <p>
            Are you sure you want to <strong>delete</strong> the user?
          </p>
        }
      >
        Delete user
      </ConfirmButton>

      <hr />

      <p>When in progress:</p>
      <ConfirmButton
        onConfirm={action('Accept clicked')}
        inProgress={true}
        dialogText={
          <p>
            Are you sure you want to <strong>delete</strong> the user?
          </p>
        }
      >
        Delete user
      </ConfirmButton>
    </div>
  );
};

export const AsButton = {
  render: AsButtonStory,
  name: 'as button'
};

const AsIconStory = () => {
  return (
    <div className="text-center">
      <p>When not in progress:</p>
      <ConfirmButton
        onConfirm={action('Accept clicked')}
        icon="delete"
        dialogText={
          <p>
            Are you sure you want to <strong>delete</strong> the user?
          </p>
        }
      />

      <hr />

      <p>When in progress:</p>
      <ConfirmButton
        onConfirm={action('Confirm clicked')}
        icon="delete"
        inProgress={true}
        dialogText={
          <p>
            Are you sure you want to <strong>delete</strong> the user?
          </p>
        }
      />
    </div>
  );
};

export const AsIcon = {
  render: AsIconStory,
  name: 'as icon'
};

const AsButtonWithIconStory = () => {
  return (
    <div className="text-center">
      <p>When not in progress:</p>
      <ConfirmButton
        onConfirm={action('Confirm clicked')}
        icon="delete"
        dialogText={
          <p>
            Are you sure you want to <strong>delete</strong> the user?
          </p>
        }
      >
        Delete user
      </ConfirmButton>

      <hr />

      <p>When in progress:</p>
      <ConfirmButton
        onConfirm={action('Confirm clicked')}
        icon="delete"
        inProgress={true}
        dialogText={
          <p>
            Are you sure you want to <strong>delete</strong> the user?
          </p>
        }
      >
        Delete user
      </ConfirmButton>
    </div>
  );
};

export const AsButtonWithIcon = {
  render: AsButtonWithIconStory,
  name: 'as button with icon'
};

const CustomTextAndColorStory = () => {
  return (
    <div className="text-center">
      <p>When not in progress:</p>
      <ConfirmButton
        color="info"
        onConfirm={action('Confirm clicked')}
        icon="delete"
        dialogText={
          <p>
            Are you sure you want to <strong>delete</strong> the user?
          </p>
        }
        text={{
          confirm: 'YES',
          cancel: 'NO',
          modalHeader: 'PLEASE SAY YES'
        }}
      >
        Delete user
      </ConfirmButton>

      <hr />

      <p>When in progress:</p>
      <ConfirmButton
        color="info"
        onConfirm={action('Confirm clicked')}
        icon="delete"
        inProgress={true}
        dialogText={
          <p>
            Are you sure you want to <strong>delete</strong> the user?
          </p>
        }
        text={{
          confirm: 'YES',
          cancel: 'NO',
          modalHeader: 'PLEASE SAY YES'
        }}
      >
        Delete user
      </ConfirmButton>
    </div>
  );
};

export const CustomTextAndColor = {
  render: CustomTextAndColorStory,
  name: 'custom text and color'
};

const FullWidthStory = () => {
  return (
    <div className="text-center">
      <p>When not in progress:</p>
      <ConfirmButton
        fullWidth={true}
        onConfirm={action('Accept clicked')}
        dialogText={
          <p>
            Are you sure you want to <strong>delete</strong> the user?
          </p>
        }
      >
        Delete user
      </ConfirmButton>

      <hr />

      <p>When in progress:</p>
      <ConfirmButton
        fullWidth={true}
        onConfirm={action('Accept clicked')}
        inProgress={true}
        dialogText={
          <p>
            Are you sure you want to <strong>delete</strong> the user?
          </p>
        }
      >
        Delete user
      </ConfirmButton>
    </div>
  );
};

export const FullWidth = {
  render: FullWidthStory,
  name: 'full width'
};
