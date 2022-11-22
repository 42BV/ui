import React from 'react';
import { Button as RSButton } from 'reactstrap';

import { Spinner } from '../Spinner/Spinner';
import { Icon } from '../Icon';
import { useShowSpinner } from './useShowSpinner';

import { ButtonProps, ButtonSize, IconType, KeyValueMapping } from '../types';
import classNames from 'classnames';

const ICON_SIZE_MAPPING: KeyValueMapping<number> = {
  lg: 32,
  md: 24,
  sm: 16
};

const SPINNER_SIZE_MAPPING: KeyValueMapping<number> = {
  lg: 19,
  md: 16,
  sm: 12
};

function getWidget(
  showSpinner: boolean,
  size: ButtonSize,
  iconPosition: 'me-2' | 'ms-2',
  outline?: boolean,
  icon?: IconType
) {
  if (showSpinner) {
    return (
      <Spinner
        size={SPINNER_SIZE_MAPPING[size]}
        color={outline ? '' : 'white'}
        className={iconPosition}
      />
    );
  } else if (icon) {
    return (
      <Icon icon={icon} className={classNames('button-icon', iconPosition)} />
    );
  }
  return null;
}

/**
 * The Button component is a clickable element which can
 * either be shown as an Icon or as a ReactStrap Button.
 *
 * The Button component also has a notion of being `inProgress` when it is
 * it shows a Spinner. But only when `inProgress` has been true for more
 * than 200 milliseconds. Useful for showing that a button is indeed
 * clicked when performing some call to the back-end.
 */
export function Button({
  type = 'button',
  color = 'primary',
  className,
  ...props
}: ButtonProps<React.ReactNode>) {
  const showSpinner = useShowSpinner(!!props.inProgress);

  function handleOnClick(event: React.MouseEvent<HTMLElement>) {
    if (props.onClick && !props.inProgress) props.onClick(event);
  }

  const {
    size = 'md',
    iconPosition = 'left',
    outline,
    fullWidth,
    inProgress,
    disabled,
    icon,
    children
  } = props;

  // If there are children it will look like a button.
  if (children) {
    const buttonProps = {
      type,
      size,
      color,
      outline,
      block: fullWidth,
      onClick: handleOnClick,
      disabled: inProgress || disabled
    };

    const widget = getWidget(
      showSpinner,
      size,
      iconPosition === 'left' ? 'me-2' : 'ms-2',
      outline,
      icon
    );

    return (
      <span
        className={classNames(
          'button',
          fullWidth ? 'd-block' : 'd-inline-block',
          className,
          color
        )}
      >
        <RSButton {...buttonProps}>
          <div className="d-flex justify-content-center align-items-center">
            <>
              {iconPosition === 'left' && widget}
              {children}
              {iconPosition === 'right' && widget}
            </>
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
          <Spinner size={ICON_SIZE_MAPPING[size]} />
        ) : (
          <Icon
            onClick={handleOnClick}
            // Use block as default icon to let the user know something is wrong
            icon={icon ?? 'block'}
            color={color}
            disabled={inProgress || disabled}
            size={ICON_SIZE_MAPPING[size]}
          />
        )}
      </span>
    );
  }
}
