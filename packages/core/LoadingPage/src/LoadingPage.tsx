import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Spinner from '@42.nl/ui-core-spinner';

interface Props {
  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
}

/**
 * The LoadingPage component embeds the Spinner component in a page-friendly matter.
 *
 * Use this for showing a loading indicator when navigating to pages that fetch data.
 */
export default function LoadingPage({ className }: Props) {
  const size = 150;

  const [showSpinner, setShowSpinner] = useState(false);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowSpinner(true);
    }, 200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={classNames('LoadingPage', className)}>
      <div
        className="vh-100 d-flex flex-column justify-content-center align-items-center"
        style={{ marginTop: -(size / 2) }}
      >
        {showSpinner && <Spinner size={size} color="#f0ad4e" />}
      </div>
    </div>
  );
}
