import React from 'react';
import classNames from 'classnames';

interface Props {
  /**
   * The mode of the ContentState:
   *
   * Use `empty` for when you want to inform the user that there
   * is now, content yet for.
   *
   * Use `no-results` for when applying a filter resulted in no results
   * matching the filters.
   *
   * Use `error` for when something went wrong.
   *
   */
  mode: 'empty' | 'no-results' | 'error';

  /**
   * The title of the ContentState component.
   */
  title: string;

  /**
   * The subTitle of the ContentState component.
   */
  subTitle: string;

  /**
   * Optional custom content you want to render below the titles.
   * You could use this to render a button for example.
   */
  children?: React.ReactNode;

  /**
   * Optional extra CSS class you want to add to the component.
   * Useful for styling the component.
   */
  className?: string;
}

/**
 * ContentState is a component which handles various non happy flow
 * states. The states it handles are: 'empty', 'no-results' and 'error'.
 *
 * It will display whimsical component which tells the user that things
 * did not go as planned / expected. Use this component whenever you
 * would otherwise display 'nothing'.
 */
export default function ContentState({
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
          <i className="material-icons">folder_open</i>
          <i className="material-icons">add</i>
          <i className="material-icons">radio_button_unchecked</i>
          <i className="material-icons">{icon}</i>
          <i className="material-icons">add</i>
          <i className="material-icons">radio_button_unchecked</i>
          <i className="material-icons">photo</i>
        </div>
      </div>

      <h4>{title}</h4>
      <h6 className="text-muted mb-3">{subTitle}</h6>
      {children}
    </div>
  );
}
