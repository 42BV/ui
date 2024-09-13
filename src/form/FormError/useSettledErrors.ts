import { useEffect, useMemo, useState } from "react";

import { MetaError } from "../types";
import { FieldMetaState } from "react-final-form";

/**
 * Final form considers a form to be `valid` when it is `validating`
 * the input. Basically you are innocent until proven guilty.
 *
 * This is annoying when the user has already made an error. Each
 * time that the input is `validating`, the input is considered `valid`
 * again. Even though it was in an error state. This causes rapid
 * alternations between `valid` and `invalid`.
 *
 * When using async validation the effect becomes very pronounced,
 * you will see the errors being displayed and removed very quickly.
 * This causes the UI to jitter and move all over the place.
 *
 * The solution is `useSettledErrors`, it basically debounces the
 * errors. This means that if N changes happen in rapid succession,
 * only the last state change is shown.
 *
 * It caches the `value` and the resulting `error` for a small window
 * of time whenever an error occurs. This way, when the same value
 * is encountered, it will return the previous error during the time
 * window. So when `final-form` performs async validations,
 * the error state will not change rapidly.
 *
 * @param meta
 * @param value
 */
export function useSettledErrors(
  meta: FieldMetaState<unknown>,
  value: any
): MetaError[] {
  const { error, submitError, active, touched, dirtySinceLastSubmit } = meta;

  const [errorCache] = useState({});

  const errors: MetaError[] = useMemo(() => {
    return error === undefined ? [] : Array.isArray(error) ? error : [error];
  }, [error]);

  const submitErrors: MetaError[] = useMemo(() => {
    return submitError === undefined || dirtySinceLastSubmit
      ? []
      : Array.isArray(submitError)
        ? submitError
        : [submitError];
  }, [submitError, dirtySinceLastSubmit]);

  const [settledErrors, setSettledErrors] = useState(errors);

  const hasErrors = errors.length > 0;

  useEffect(() => {
    let timeout: number | undefined;

    function showErrors() {
      // Store the errors for this value.
      errorCache[value] = errors;

      setSettledErrors(errors);
    }

    function hideErrors() {
      /* 
        Only hide the errors when there are no errors, and the value 
        did not have an error previously, this can be true when an 
        async call is made and final-form considers it valid again.
        We say when that value previously has an error it is likely 
        to still have an error, for at least 2 seconds.
      */
      if (settledErrors.length > 0 && errorCache[value] === undefined) {
        setSettledErrors([]);
      } else {
        /*
          If after 2 seconds no new validity is reported then clear
          the caches and hide the errors. This is necessary for when 
          the same value produces no errors at a later time.
          
          This can happen in the following scenario:
          The user has to select a start and end date for a calendar.
          First he selects for the start 2020-01-15 and for the end
          2020-01-10. The end date will trigger an error that it must
          be after the start date the cache will be:
          `{ "2020-01-10": 'End date must be after start date' }`. 
          
          If the user then selects a start date of 2020-01-01 the 
          previously wrong 2020-01-10 end date will now suddenly be 
          correct. If we do not clear the cached value after a while
          the error would forever be presented to the user.
        */
        timeout = window.setTimeout(clearCacheAndHideErrors, 2000);
      }
    }

    function clearCacheAndHideErrors() {
      errorCache[value] = undefined;
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
          hideErrors();
        }
      } else {
        /* 
          When there are no errors delay until the final valid state
          is reached. Even when the field is not active other fields in
          the form which are active will trigger the 'validating' state.
          We delay showing the message to prevent the UI from jittering.
        */
        timeout = window.setTimeout(hideErrors, 2000);
      }
    }

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    hasErrors,
    active,
    touched,
    errors,
    submitErrors,
    settledErrors.length,
    errorCache,
    value
  ]);

  return [...settledErrors, ...submitErrors];
}
