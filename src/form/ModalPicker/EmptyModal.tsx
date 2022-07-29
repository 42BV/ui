import React from 'react';
import { ContentState } from '../../core/ContentState/ContentState';
import { t } from '../../utilities/translation/translation';

type Props = {
  /**
   * Whether or not the user performed a search.
   */
  userHasSearched: boolean;
  title?: string;
  subTitle?: string;
};

/**
 * The EmptyModal is a component which is rendered when a
 * Modal is empty. Can either display a message saying that
 * it is empty when there is nothing to be selected. Or a
 * message saying that there is no result for the current
 * search query when the user has searched.
 */
export function EmptyModal(props: Props) {
  const { userHasSearched, title, subTitle } = props;
  if (userHasSearched) {
    return (
      <ContentState
        mode="no-results"
        title={t({
          key: 'EmptyModal.NO_RESULTS.TITLE',
          fallback: 'Empty',
          overrideText: title
        })}
        subTitle={t({
          key: 'EmptyModal.NO_RESULTS.SUBTITLE',
          fallback:
            'No results were found please try again with a different query.',
          overrideText: subTitle
        })}
      />
    );
  } else {
    return (
      <ContentState
        mode="empty"
        title={t({
          key: 'EmptyModal.EMPTY.TITLE',
          fallback: 'Empty',
          overrideText: title
        })}
        subTitle={t({
          key: 'EmptyModal.EMPTY.SUBTITLE',
          fallback: 'There is nothing here yet, the collection is empty.',
          overrideText: subTitle
        })}
      />
    );
  }
}
