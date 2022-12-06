/* istanbul ignore file */

import React from 'react';
import { IconType } from './Icon';

export type Color =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'link'
  | 'muted'
  | 'dark'
  | 'light';

export type BootstrapSize = 'xs' | 'sm' | 'md' | 'lg';

type Side = 'top' | 'right' | 'bottom' | 'left';
type StartOrEnd = 'start' | 'end';
export type TippyPlacement = Side | `${Side}-${StartOrEnd}`;

export type WithChildren<TChildren> = {
  children: TChildren;
};

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonIconPosition = 'left' | 'right';
export type ButtonProps = {
  /**
   * Optionally the type of button it is, defaults to 'button'.
   *
   * @default button
   */
  type: 'button' | 'submit' | 'reset';

  /**
   * Optionally the color of the button.
   */
  color: Color;

  /**
   *  Optional callback for what needs to happen when the button is clicked.
   */
  onClick: (event: React.MouseEvent<HTMLElement>) => any;

  /**
   * Whether the action you are performing is currently in progress.
   * If so, a spinner is rendered inside the button.
   * This behavior is optional and defaults to `false`.
   *
   * @default false
   */
  inProgress: boolean;

  /**
   * Optionally whether the button is disabled
   *
   * Defaults to `false`
   */
  disabled: boolean;

  /**
   * Optionally the Icon you want to use.
   */
  icon: IconType;

  /**
   * Optionally the position of the icon, either left or right.
   * Defaults to "left".
   *
   * Only applicable when the `icon` prop is set.
   */
  iconPosition: ButtonIconPosition;

  /**
   * Optionally whether to show the button only as an outline.
   */
  outline: boolean;

  /**
   * Optionally the size of the button, or icon when only the icon
   * is rendered.
   *
   * Defaults to 'md'.
   */
  size: ButtonSize;

  /**
   * Optionally whether the button should take the full width available.
   *
   * Defaults to `false`
   */
  fullWidth: boolean;
} & Partial<Omit<HTMLButtonElement, 'children'>>;
