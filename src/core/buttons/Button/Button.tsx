import React from 'react';
import { Button as RSButton } from 'reactstrap';

import { Spinner } from '../../Spinner/Spinner';
import { Icon, IconType } from '../../Icon';
import { useShowSpinner } from '../useShowSpinner';

import {
  ButtonIconPosition,
  ButtonProps as GButtonProps,
  ButtonSize
} from '../../types';
import classNames from 'classnames';

type ButtonProps = {
  children: React.ReactNode;
} & Partial<GButtonProps>;

function getWidget(
  showSpinner: boolean,
  size: ButtonSize,
  outline: boolean,
  iconPosition: ButtonIconPosition,
  icon?: IconType
) {
  if (showSpinner) {
    return (
      <Spinner
        size={getSpinnerSize(size)}
        color={outline ? '' : 'white'}
        className={iconPosition === 'left' ? 'me-2' : 'ms-2'}
      />
    );
  } else if (icon) {
    return (
      <Icon
        icon={icon}
        className={classNames(
          'button-icon',
          iconPosition === 'left' ? 'me-2' : 'ms-2'
        )}
      />
    );
  }
  return null;
}

/**
 * The buttons component is a clickable element which can
 * either be shown as an Icon or as a ReactStrap buttons.
 *
 * The buttons component also has a notion of being `inProgress` when it is
 * it shows a Spinner. But only when `inProgress` has been true for more
 * than 200 milliseconds. Useful for showing that a button is indeed
 * clicked when performing some call to the back-end.
 */
export function Button({
  type = 'button',
  color = 'primary',
  inProgress,
  className = '',
  onClick,
  size = 'md',
  outline,
  fullWidth,
  iconPosition = 'left',
  icon,
  disabled,
  children
}: ButtonProps) {
  const showSpinner = useShowSpinner(!!inProgress);

  function handleOnClick(event: React.MouseEvent<HTMLElement>) {
    if (!onClick) {
      return;
    }
    if (!inProgress) {
      onClick(event);
    }
  }

  const buttonProps = {
    type,
    size,
    color,
    outline,
    block: fullWidth
  };

  const widget = getWidget(showSpinner, size, !!outline, iconPosition, icon);

  return (
    <span
      className={classNames(
        'button',
        fullWidth ? 'd-block' : 'd-inline-block',
        className,
        color
      )}
    >
      <RSButton
        onClick={handleOnClick}
        disabled={inProgress || disabled}
        {...buttonProps}
      >
        <div className="d-flex justify-content-center align-items-center">
          {iconPosition === 'left' && widget}
          {children}
          {iconPosition === 'right' && widget}
        </div>
      </RSButton>
    </span>
  );
}

// Based on the sizes in pixels of a button with text but without an icon
export function getSpinnerSize(size?: ButtonSize): number {
  switch (size) {
    case 'lg':
      return 19;

    case 'md':
      return 16;

    case 'sm':
      return 12;
  }
  return 7;
}
