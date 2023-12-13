import { Button, ButtonSize } from '../Button/Button';
import { IconType } from '../Icon';
import { useScrollToClosestError } from './useScrollToClosestError';
import { ReactNode } from 'react';

export type Props = {
  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optionally the size of the button
   *
   * Defaults to 'md'.
   */
  size?: ButtonSize;

  /**
   * Optional callback for what needs to happen when the button is clicked.
   */
  onClick?: (event: MouseEvent<HTMLElement>) => any;

  /**
   * The text of the button.
   */
  children?: ReactNode;

  /**
   * Whether the action you are performing is currently in
   * progress. If so a spinner is rendered inside the button.
   */
  inProgress: boolean;

  /**
   * Optionally whether to scroll to the closest error message.
   *
   * Defaults to `true`
   */
  scrollToClosestError?: boolean;

  /**
   * Optionally the Icon you want to use.
   *
   * Defaults to 'save'.
   */
  icon?: IconType;
};

/**
 * A SubmitButton is a Button with default 'save' icon and  a button
 * of type "submit". It will scroll to the closest error when
 * `scrollToClosestError` is `true` which it is by default.
 */
export function SubmitButton({
  children,
  inProgress,
  size,
  className = undefined,
  onClick,
  scrollToClosestError = true,
  icon = 'save'
}: Props) {
  const { doScrollToClosestError } = useScrollToClosestError({
    enabled: scrollToClosestError
  });

  function submitAndScrollToClosestError(event: MouseEvent<HTMLElement>) {
    doScrollToClosestError();

    if (onClick) {
      onClick(event);
    }
  }

  return (
    <Button
      type="submit"
      size={size}
      color="primary"
      inProgress={inProgress}
      className={className}
      onClick={submitAndScrollToClosestError}
      icon={icon}
    >
      {children}
    </Button>
  );
}
