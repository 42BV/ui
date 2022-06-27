import React from 'react';
import classNames from 'classnames';

import { Spinner } from '../Spinner/Spinner';

import { t } from '../../utilities/translation/translation';

type Text = {
  /**
   * Loading text which is shown by default
   */
  loading?: string;
};

type Props = {
  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  text?: Text;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * Optional text to show next to the loading indicator.
   */
  children?: React.ReactNode;
};

export function Loading({ children, className, text = {} }: Props) {
  const classes = classNames('d-flex', className);

  return (
    <div className={classes}>
      <Spinner className="align-self-center" color="black" size={16} />
      <span className="ms-1">
        {children
          ? children
          : t({
            key: 'Loading.LOADING',
            fallback: 'Loading...',
            overrideText: text.loading
          })}
      </span>
    </div>
  );
}
