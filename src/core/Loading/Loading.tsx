import React from 'react';
import classNames from 'classnames';

import { Spinner } from '../Spinner/Spinner';

import { t } from '../../utilities/translation/translation';
import { UIBasePropsWithCSSPropertiesAndChildren } from '../types';

type Props = {
  /**
   * Optionally customized text within the component.
   * This text should already be translated.
   */
  loading?: string;
} & Partial<UIBasePropsWithCSSPropertiesAndChildren<React.ReactNode>>;

export function Loading({ children, className, loading }: Props) {
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
              overrideText: loading
            })}
      </span>
    </div>
  );
}
