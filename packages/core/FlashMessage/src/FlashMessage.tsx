import React from 'react';
import { Alert } from 'reactstrap';
import classNames from 'classnames';
import {
  removeFlashMessage,
  FlashMessage as FlashMessageShape,
  useFlashMessages
} from '@42.nl/react-flash-messages';

interface Props {
  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   *
   * @type {string}
   * @memberof Props
   */
  className?: string;
}

/**
 * FlashMessage is a graphical implementation for @see {@link https://github.com/42BV/react-flash-messages}.
 *
 * Use it when you want to globally show a notification / message.
 *
 * @exports FlashMessage
 * @returns {JSX.Element}
 */
export default function FlashMessage({ className }: Props): JSX.Element {
  const flashMessages = useFlashMessages();

  if (flashMessages.length === 0) {
    return null;
  }

  /**
   * Remove FlashMessage upon clicking.
   *
   * @param flashMessage
   */
  function onFlashMessageClick(flashMessage: FlashMessageShape<any>) {
    flashMessage.onClick();
    removeFlashMessage(flashMessage);
  }

  return (
    <div className={classNames('flash-messages', className)}>
      {flashMessages.map((flashMessage: FlashMessageShape<any>) => (
        <Alert
          color={messageColorByType(flashMessage.type)}
          key={flashMessage.id}
          open={true}
          toggle={() => onFlashMessageClick(flashMessage)}
        >
          {flashMessage.text}
        </Alert>
      ))}
    </div>
  );
}

/**
 * Assign bootstrap colors to specific FlashMessage types.
 *
 * @param {string} type
 * @returns {string}
 */
function messageColorByType(type: string): string {
  switch (type) {
    case 'SUCCESS':
      return 'success';
    case 'WARNING':
      return 'warning';
    case 'ERROR':
    case 'APOCALYPSE':
      return 'danger';
    case 'INFO':
    default:
      return 'info';
  }
}
