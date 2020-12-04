import classNames from 'classnames';
import React, { CSSProperties } from 'react';
import Spinner from '../Spinner/Spinner';
import { useShowAfter } from '../useShowAfter/useShowAfter';

type Props = {
  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optional extra CSSProperties you want to add to the component.
   * Useful for styling the component.
   */
  style?: CSSProperties;

  /**
   * Optionally a height, by default this will be the full height
   * of the view port.
   */
  height?: number;
};

/**
 * The LoadingPage component embeds the Spinner component in a page-friendly matter.
 *
 * Use this for showing a loading indicator when navigating to pages that fetch data.
 */
export default function LoadingPage({ className, style, height }: Props) {
  const size = 150;

  const showSpinner = useShowAfter(200);

  return (
    <div className={classNames('loading-page', className)} style={style}>
      <div
        className={classNames(
          'd-flex flex-column justify-content-center align-items-center',
          { 'vh-100': height === undefined }
        )}
        style={{
          marginTop: height === undefined ? -(size / 2) : undefined,
          height
        }}
      >
        {showSpinner && <Spinner size={size} color="#f0ad4e" />}
      </div>
    </div>
  );
}
