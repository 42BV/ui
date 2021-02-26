import React from 'react';
import { t } from '../../utilities/translation/translation';

/**
 * Renders:
 *
 * --- Or ---
 */
export function OrSeparator() {
  return (
    <div className="my-2 px-5 d-flex align-items-center">
      <div className="border-top flex-grow-1 position-relative" />
      <em className="mx-2">
        {t({
          key: 'OrSeparator.OR',
          fallback: 'OR'
        })}
      </em>
      <div className="border-top flex-grow-1 position-relative" />
    </div>
  );
}
