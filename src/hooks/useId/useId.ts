import { useEffect, useState } from 'react';
import { uniqueId } from 'lodash';

type UseIdConfig = {
  /**
   * Optionally the id to use. When no id is provided a unique id
   * is generated.
   */
  id?: string;
};

/**
 * Either returns the id provided or when it is not defined generates
 * a unique stable id and returns that id.
 *
 * @param {UseIdConfig} useIdConfig The configuration for useId
 * @returns {string} The id.
 */
export function useId({ id }: UseIdConfig): string {
  const [ innerId, setInnerId ] = useState(() => id ?? uniqueId());
  useEffect(() => {
    if (id) {
      setInnerId(id);
    }
  }, [ id ]);

  return innerId;
}
