import React from 'react';
import classNames from 'classnames';
import { UIBasePropsWithCSSProperties, WithSize } from '../types';

type Props = {
  color?: string;
} & WithSize<number> &
  Partial<Omit<UIBasePropsWithCSSProperties, 'color'>>;

/**
 * Spinner is a component which is used as a loading indicator.
 *
 * Use it for example when data is fetching during navigation to a page.
 */
export function Spinner({ className, size, color }: Props) {
  return (
    <svg
      className={classNames('spinner', className)}
      width={size}
      height={size}
      viewBox="25 25 50 50"
    >
      <circle
        className="path"
        fill="none"
        stroke={color ? color : ''}
        cx="50"
        cy="50"
        r="20"
        strokeWidth="4"
        strokeMiterlimit="10"
      />
    </svg>
  );
}
