import React, { useState } from 'react';

import { AsyncActionButton } from './AsyncActionButton';
import { FlashMessage } from '../FlashMessage/FlashMessage';

export default {
  title: 'core/buttons/AsyncActionButton',

  parameters: {
    component: AsyncActionButton
  }
};

const DefaultStory = () => {
  const [counter, setCounter] = useState(0);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  function asyncAction() {
    setError(undefined);
    setSuccess(undefined);
    setCounter(counter + 1);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (counter % 2 === 0) {
          resolve({
            message: 'Confirmation successfully sent'
          });
        } else {
          reject('You are not allowed to perform this action');
        }
      }, 1000);
    }).then(
      ({ message }) => setSuccess(message),
      (reason: string) => setError(reason)
    );
  }

  return (
    <div className="text-center">
      <p>
        The best user experience is when you use flash messages to make the user
        aware the request succeeded or failed.
      </p>

      {error ? (
        <FlashMessage color="danger" onClose={() => setError(undefined)}>
          {error}
        </FlashMessage>
      ) : null}
      {success ? (
        <FlashMessage color="success" onClose={() => setSuccess(undefined)}>
          {success}
        </FlashMessage>
      ) : null}

      <AsyncActionButton action={asyncAction}>
        Resend confirmation
      </AsyncActionButton>
    </div>
  );
};

export const Default = {
  render: DefaultStory,
  name: 'default'
};
