import React from 'react';
import classNames from 'classnames';

interface Props {
  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   *
   * @type {string}
   * @memberof Props
   */
  className?: string;

  /**
   * Color of the circle within the spinner.
   *
   * @type {string}
   * @memberof Props
   */
  color: string;

  /**
   * Width and height of the spinner.
   *
   * @type {number}
   * @memberof Props
   */
  size: number;
}

/**
 * Spinner is a component which is used as a loading indicator.
 *
 * Use it for example when data is fetching during navigation to a page.
 *
 * @exports Spinner
 * @param {Props} props
 * @returns {JSX.Element}
 */
export default function Spinner({
  className,
  color,
  size
}: Props): JSX.Element {
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
        stroke={color}
        cx="50"
        cy="50"
        r="20"
        strokeWidth="4"
        strokeMiterlimit="10"
      />
    </svg>
  );
}
