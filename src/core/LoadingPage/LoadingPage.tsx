import classNames from 'classnames';
import React from 'react';
import { Spinner } from '../Spinner/Spinner';
import { useShowAfter } from '../../hooks/useShowAfter/useShowAfter';
import { UIBasePropsWithCSSProperties } from '../types';

type Props = {
  /**
   * Optionally a height, by default this will be the full height
   * of the view port.
   */
  height?: number;
} & Partial<UIBasePropsWithCSSProperties>;

/**
 * The LoadingPage component embeds the Spinner component in a page-friendly matter.
 *
 * Use this for showing a loading indicator when navigating to pages that fetch data.
 */
export function LoadingPage({ className, style, height }: Props) {
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
