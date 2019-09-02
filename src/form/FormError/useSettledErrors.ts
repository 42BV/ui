import { useState, useEffect } from 'react';
import { isArray } from 'lodash';

import { Meta, MetaError } from '../types';

/**
 * Final form considers a form to be `valid` when it is `validating`
 * the input. Basically you are innocent until proven quilty.
 *
 * This is annoying when the user has already made an error. Each
 * time that the input in `validating` the input is considered `valid`
 * again. Even though it was in an error state. This causes rapid
 * alternations between `valid` and `invalid`.
 *
 * When using async validation the effect becomes very pronounced,
 * you will see the errors being displayed and removed very quickly.
 * This causes the UI to jitter and move all over the place.
 *
 * The solution is `useSettledErrors`, it basically debounces the
 * errors, this means that if N changes happen in rapid succession
 * only the last state change is shown.
 *
 * @param meta
 */
export function useSettledErrors(meta: Meta): MetaError[] {
  const { error, active, touched } = meta;

  const errors: MetaError[] =
    error === undefined ? [] : isArray(error) ? error : [error];

  const [settledErrors, setSettledErrors] = useState(errors);

  const hasErrors = errors.length > 0;

  useEffect(() => {
    let timeout: number | undefined;

    function showErrors() {
      setSettledErrors(errors);
    }

    function hideErrors() {
      setSettledErrors([]);
    }

    if (active) {
      if (hasErrors) {
        // When active and there are errors delay until the final valid
        // state is reached. When the user continues "typing" the state
        // will toggle really fast between valid / invalid. We delay
        // showing the message to prevent the UI from jittering.
        timeout = window.setTimeout(showErrors, 5000);
      } else {
        // Remove the error when the user fixes the input.
        timeout = window.setTimeout(hideErrors, 100);
      }
    } else {
      if (hasErrors) {
        if (touched) {
          // If the field is touched but not active show errors relatively quickly
          timeout = window.setTimeout(showErrors, 100);
        } else {
          // Hide errors for fields which are never touched immediately
          hideErrors();
        }
      } else {
        // When there are no errors delay until the final valid state
        // is reached. Even when the field is not active other fields in
        // the form which are active will trigger the 'validating' state.
        // We delay showing the message to prevent the UI from jittering.
        timeout = window.setTimeout(hideErrors, 2000);
      }
    }

    return () => {
      window.clearTimeout(timeout);
    };
  }, [hasErrors, active, touched, errors]);

  return settledErrors;
}