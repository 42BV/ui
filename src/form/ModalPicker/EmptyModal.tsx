import React from 'react';
import ContentState from '../../core/ContentState/ContentState';
import { getTranslator } from '../translator';

interface Props {
  /**
   * Whether or not the user performed a search.
   */
  userHasSearched: boolean;
}

/**
 * The EmptyModal is a component which is rendered when a
 * Modal is empty. Can either display a message saying that
 * it is empty when there is nothing to be selected. Or a
 * message saying that there is no result for the current
 * search query when the user has searched.
 */
export default function EmptyModal(props: Props) {
  const { userHasSearched } = props;

  const translator = getTranslator();

  if (userHasSearched) {
    return (
      <ContentState
        mode="no-results"
        title={translator({
          key: 'EmptyModal.NO_RESULTS.TITLE',
          fallback: 'No results'
        })}
        subTitle={translator({
          key: 'EmptyModal.NO_RESULTS.SUBTITLE',
          fallback:
            'No results were found please try again with a different query.'
        })}
      />
    );
  } else {
    return (
      <ContentState
        mode="empty"
        title={translator({
          key: 'EmptyModal.EMPTY.TITLE',
          fallback: 'Empty'
        })}
        subTitle={translator({
          key: 'EmptyModal.EMPTY.SUBTITLE',
          fallback: 'There is nothing here yet, the collection is empty.'
        })}
      />
    );
  }
}
