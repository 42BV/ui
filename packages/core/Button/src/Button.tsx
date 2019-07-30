import React from 'react';
import { Button as RSButton } from 'reactstrap';

import Spinner from '@42.nl/ui-core-spinner';
import { Color } from '@42.nl/ui-core-types';
import { Icon, IconType } from '@42.nl/ui-core-icon';

import useShowSpinner from './useShowSpinner';

interface BaseProps {
  /**
   * Optionally the type of button it is, defaults to 'button'.
   *
   * @default button
   */
  type?: 'button' | 'submit';

  /**
   * Optionally the color of the button.
   */
  color?: Color;

  /**
   *  Optional callback for what needs to happen when the button is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => any;

  /**
   * Whether or not the action you are performing is currenlty in
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
}

interface WithIconAndText extends BaseProps {
  /**
   * Optionally the Icon you want to use.
   */
  icon: IconType;

  /**
   * Optionally the text of the button.
   */
  children: React.ReactNode;

  /**
   * Optionally whether or not to show the button only as an outline.
   */
  outline?: boolean;

  /**
   * Optionally the size of the button, defaults to md.
   *
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
}

interface WithIcon extends BaseProps {
  /**
   * The Icon you want to use.
   */
  icon: IconType;
}

interface WithText extends BaseProps {
  /**
   * Optionally the text of the button.
   */
  children: React.ReactNode;

  /**
   * Optionally whether or not to show the button only as an outline.
   */
  outline?: boolean;

  /**
   * Optionally the size of the button, defaults to md.
   *
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
}

export type Props = WithIcon | WithText | WithIconAndText;

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

  const children = 'children' in props ? props.children : undefined;
  const icon = 'icon' in props ? props.icon : undefined;

  if (children !== undefined) {
    const outline = 'outline' in props ? props.outline : undefined;
    const size = 'size' in props ? props.size : 'md';

    const buttonProps = {
      type,
      size,
      color,
      outline
    };

    return (
      <span className={`Button ${className} ${color}`}>
        <RSButton
          onClick={handleOnClick}
          disabled={inProgress}
          {...buttonProps}
        >
          {showSpinner ? (
            <Spinner size={16} color={outline ? '' : 'white'} />
          ) : icon !== undefined ? (
            <Icon icon={icon} />
          ) : null}
          {children}
        </RSButton>
      </span>
    );
  } else {
    // We know that at this point it must be have icon,
    // because the Button now extends WithIcon.
    const iconCast = icon as IconType;

    return (
      <span className={`Button ${className} ${color}`}>
        {showSpinner ? (
          // Color is empty string so we can override the color
          <Spinner size={24} color="" />
        ) : (
          <Icon onClick={handleOnClick} icon={iconCast} color={color} />
        )}
      </span>
    );
  }
}
