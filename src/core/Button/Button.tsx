import { Button as RSButton, ButtonProps } from 'reactstrap';

import { Spinner } from '../Spinner/Spinner';
import { Icon, IconType } from '../Icon';
import { useShowSpinner } from './useShowSpinner/useShowSpinner';

import { Color } from '../types';
import classNames from 'classnames';

import './Button.scss';
import { MouseEventHandler } from 'react';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonIconPosition = 'left' | 'right';

export type Props = Omit<ButtonProps, 'size' | 'color' | 'type'> & {
  /**
   * Optionally the type of button it is, defaults to 'button'.
   *
   * @default button
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Optionally the color of the button.
   */
  color?: Color;

  /**
   * Whether the action you are performing is currently in progress.
   * If so, a spinner is rendered inside the button.
   * This behavior is optional and defaults to `false`.
   *
   * @default false
   */
  inProgress?: boolean;

  /**
   * Optionally the Icon you want to use.
   */
  icon?: IconType;

  /**
   * Optionally the position of the icon, either left or right.
   * Defaults to "left".
   *
   * Only applicable when the `icon` prop is set.
   */
  iconPosition?: ButtonIconPosition;

  /**
   * Optionally whether to show the button only as an outline.
   */
  outline?: boolean;

  /**
   * Optionally the size of the button, or icon when only the icon
   * is rendered.
   *
   * Defaults to 'md'.
   */
  size?: ButtonSize;

  /**
   * Optionally whether the button should take the full width available.
   *
   * Defaults to `false`
   */
  fullWidth?: boolean;
};

/**
 * The Button component is a clickable element which can
 * either be shown as an Icon or as a ReactStrap Button.
 *
 * The Button component also has a notion of being `inProgress` when it is
 * it shows a Spinner. But only when `inProgress` has been true for more
 * than 200 milliseconds. Useful for showing that a button is indeed
 * clicked when performing some call to the back-end.
 */
export function Button(props: Readonly<Props>) {
  const {
    type = 'button',
    inProgress,
    onClick,
    children,
    size = 'md',
    fullWidth,
    disabled,
    iconPosition = 'left'
  } = props;

  const handleOnClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (!onClick) {
      return;
    }

    if (!inProgress) {
      onClick(event);
    }
  };

  const buttonProps: ButtonProps = {
    ...props,
    type,
    size,
    block: fullWidth,
    disabled: disabled || inProgress
  };

  return (
    <RSButton onClick={handleOnClick} {...buttonProps}>
      <div className="d-flex justify-content-center align-items-center">
        {iconPosition === 'left' ? (
          <Widget {...props} className="me-2" />
        ) : null}
        {children}
        {iconPosition === 'right' ? (
          <Widget {...props} className="ms-2" />
        ) : null}
      </div>
    </RSButton>
  );
}

function Widget({
  inProgress,
  icon,
  size = 'md',
  outline,
  className
}: Readonly<
  Pick<Props, 'inProgress' | 'icon' | 'size' | 'outline' | 'className'>
>) {
  const showSpinner = useShowSpinner(!!inProgress);
  if (showSpinner) {
    return (
      <Spinner
        size={getSpinnerSize(size)}
        color={outline ? '' : 'white'}
        className={className}
      />
    );
  }

  return icon ? (
    <Icon icon={icon} className={classNames('button-icon', className)} />
  ) : null;
}

// Based md is based on default the size of the Icon component
export function getIconSize(size: ButtonSize): number {
  switch (size) {
    case 'lg':
      return 32;

    case 'md':
      return 24;

    case 'sm':
      return 16;
  }
}

// Based on the sizes in pixels of a button with text but without an icon
export function getSpinnerSize(size: ButtonSize): number {
  switch (size) {
    case 'lg':
      return 19;

    case 'md':
      return 16;

    case 'sm':
      return 12;
  }
}
