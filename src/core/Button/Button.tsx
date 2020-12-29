import React from 'react';
import { Button as RSButton } from 'reactstrap';

import Spinner from '../Spinner/Spinner';
import { Icon, IconType } from '../Icon';
import useShowSpinner from './useShowSpinner';

import { Color } from '../..';
import classNames from 'classnames';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type IconPosition = 'left' | 'right';

export type Props = {
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
   *  Optional callback for what needs to happen when the button is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => any;

  /**
   * Whether or not the action you are performing is currently in
   * progress. If so a spinner is rendered inside of the button.
   * This behavior is optional and default to `false`.
   *
   * @default false
   */
  inProgress?: boolean;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optionally whether the button is disabled
   *
   * Defaults to `false`
   */
  disabled?: boolean;

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
  iconPosition?: IconPosition;

  /**
   * Optionally whether or not to show the button only as an outline.
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
   * Optionally whether or not the button should take the full width
   * available.
   *
   * Defaults to `false`
   */
  fullWidth?: boolean;

  /**
   * Optionally the text of the button.
   */
  children?: React.ReactNode;
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
export default function Button({
  type = 'button',
  color = 'primary',
  inProgress,
  className = '',
  onClick,
  ...props
}: Props) {
  const showSpinner = useShowSpinner(!!inProgress);

  function handleOnClick(event: React.MouseEvent<HTMLElement>) {
    if (!onClick) {
      return;
    }

    if (!inProgress) {
      onClick(event);
    }
  }

  const {
    children,
    outline,
    size = 'md',
    fullWidth,
    disabled,
    icon,
    iconPosition = 'left'
  } = props;

  // If there are children it will look like a button.
  if (children) {
    const buttonProps = {
      type,
      size,
      color,
      outline,
      block: fullWidth
    };

    const widget = showSpinner ? (
      <Spinner
        size={getSpinnerSize(size)}
        color={outline ? '' : 'white'}
        className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}
      />
    ) : icon ? (
      <Icon
        icon={icon}
        className={classNames(
          'button-icon',
          iconPosition === 'left' ? 'mr-2' : 'ml-2'
        )}
      />
    ) : null;

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
          <div className="d-flex align-items-center">
            {iconPosition === 'left' && widget}
            {children}
            {iconPosition === 'right' && widget}
          </div>
        </RSButton>
      </span>
    );
  } else {
    return (
      <span
        className={classNames(
          'button',
          className,
          color,
          fullWidth ? 'd-flex' : 'd-inline-block',
          {
            'justify-content-start': fullWidth && iconPosition === 'left',
            'justify-content-end': fullWidth && iconPosition === 'right'
          }
        )}
      >
        {showSpinner ? (
          // Size is the same size as the icon.
          // Color is empty string so we can override the color
          <Spinner size={getIconSize(size)} color="" />
        ) : (
          <Icon
            onClick={handleOnClick}
            // Use block as default icon to let the user know something is wrong
            icon={icon ?? 'block'}
            color={color}
            disabled={inProgress || disabled}
            size={getIconSize(size)}
          />
        )}
      </span>
    );
  }
}

// Based on the sizes in px's of a button with text but without an icon
export function getIconSize(size: ButtonSize): number {
  switch (size) {
    case 'lg':
      return 39;

    case 'md':
      return 35;

    case 'sm':
      return 31;
  }
}

// Based on the sizes in px's of a button with text but without an icon
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
