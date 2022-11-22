import React from 'react';
import classNames from 'classnames';

import { Icon } from '../Icon';
import { ContentStateMode, ContentStateProps } from '../types';
import { Spinner } from '../Spinner/Spinner';

function selectIcon(mode: ContentStateMode | undefined) {
  if (mode === 'empty') {
    return 'laptop';
  } else if (mode === 'error') {
    return 'sentiment_very_dissatisfied';
  } else {
    return 'search';
  }
}

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
  className,
  contentStateDivProps,
  stateIconDivProps,
  iconProps,
  stateContentDivProps,
  children,
  ...props
}: Partial<ContentStateProps>) {
  const icon = selectIcon(mode);

  return (
    <div className={classNames('text-center', className)} {...props}>
      <div
        className={classNames('content-state', mode)}
        {...contentStateDivProps}
      >
        <div className="state-icons" {...stateIconDivProps}>
          <Icon icon="add" {...iconProps} />
          <Icon icon="contrast" {...iconProps} />
          <Icon icon="photo" {...iconProps} />
          <Icon icon="folder_open" {...iconProps} />
          <Icon icon="radio_button_unchecked" {...iconProps} />
          <Icon icon="bolt" {...iconProps} />
        </div>
        <div className="state-content" {...stateContentDivProps}>
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
