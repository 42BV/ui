import React from 'react';
import classNames from 'classnames';
import { Spinner } from '../../Spinner/Spinner';
import { Icon } from '../../Icon';
import { ButtonProps, ButtonSize } from '../../types';
import { useShowSpinner } from '../useShowSpinner';

type IconButtonProps = Partial<ButtonProps>;

export function IconButton({
  className,
  color = 'primary',
  fullWidth = false,
  iconPosition = 'left',
  onClick,
  size = 'md',
  icon,
  inProgress = false,
  disabled = false
}: IconButtonProps) {
  const showSpinner = useShowSpinner(inProgress);

  function onHandleClick(event: React.MouseEvent<HTMLElement>) {
    if (!onClick) return;
    if (!inProgress) onClick(event);
  }

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
          onClick={onHandleClick}
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
