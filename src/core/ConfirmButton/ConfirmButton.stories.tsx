import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ConfirmButton from './ConfirmButton';

storiesOf('core|buttons/ConfirmButton', module)
  .addParameters({ component: ConfirmButton })
  .add('as button', () => {
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
  })
  .add('as icon', () => {
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
  })
  .add('as button with icon', () => {
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
  })
  .add('custom text and color', () => {
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
          confirmText="YES"
          cancelText="NO"
          modalHeaderText="PLEASE SAY YES"
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
          confirmText="YES"
          cancelText="NO"
          modalHeaderText="PLEASE SAY YES"
        >
          Delete user
        </ConfirmButton>
      </div>
    );
  });
