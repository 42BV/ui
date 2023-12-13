import classNames from 'classnames';

import { Icon } from '../Icon';
import { Spinner } from '../Spinner/Spinner';

import './ContentState.scss';
import { ReactNode } from 'react';

export type ContentStateMode = 'empty' | 'no-results' | 'error' | 'loading';

type Props = {
  /**
   * The mode of the ContentState:
   *
   * Use `empty` for when you want to inform the user that there
   * is no content yet.
   *
   * Use `no-results` for when applying a filter resulted in no results
   * matching the filters.
   *
   * Use `error` for when something went wrong.
   *
   * Use `loading` for when something is still loading.
   *
   */
  mode: ContentStateMode;

  /**
   * Optional custom content you want to render below the titles.
   * You could use this to render a button for example.
   */
  children?: ReactNode;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;

  /**
   * The title of the ContentState component.
   */
  title: string;

  /**
   * The subTitle of the ContentState component.
   */
  subTitle?: string;
};

/**
 * ContentState is a component which handles various non-happy flow
 * states. The states it handles are: 'empty', 'no-results' and 'error'.
 *
 * It will display whimsical component which tells the user that things
 * did not go as planned / expected. Use this component whenever you
 * would otherwise display 'nothing'.
 */
export function ContentState({
  mode,
  title,
  subTitle,
  children,
  className
}: Props) {
  const icon =
    mode === 'empty'
      ? 'laptop'
      : mode === 'error'
        ? 'sentiment_very_dissatisfied'
        : 'search';

  return (
    <div className={classNames('text-center', className)}>
      <div className={classNames('content-state', mode)}>
        <div className="state-icons">
          <Icon icon="add" />
          <Icon icon="contrast" />
          <Icon icon="photo" />
          <Icon icon="folder_open" />
          <Icon icon="radio_button_unchecked" />
          <Icon icon="bolt" />
        </div>
        <div className="state-content">
          {mode === 'loading' ? (
            <Spinner className="mb-2" color="#f0ad4e" size={75} />
          ) : (
            <Icon icon={icon} />
          )}
        </div>
      </div>
      <span className="d-block fs-4">{title}</span>
      {subTitle && (
        <span className="d-block fs-6 text-dark mb-3">{subTitle}</span>
      )}
      {children}
    </div>
  );
}
