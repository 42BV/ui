import React from 'react';
import { FormSpy } from 'react-final-form';
import { FormState } from 'final-form';
import { isEqual } from 'lodash';

import { useActive } from './useActive';
import { usePromise } from './usePromise';

type Props<FormValues, T> = {
  /**
   * Callback fired on blur when value of the form element changed.
   *
   * @param values
   */
  onSave: (values: FormValues) => Promise<T> | undefined;

  /**
   * The initial values to compare to.
   */
  initialValues?: FormValues;
};

export function AutoSave<FormValues, T>(props: Props<FormValues, T>) {
  const { onSave, initialValues } = props;
  const [ active, setActive ] = useActive();
  const promise = usePromise<T>();

  async function onChange(formState: FormState<FormValues>) {
    if (active === formState.active) {
      return;
    }

    const activeAsString = formState.active as string;
    setActive(activeAsString);

    if (!active) {
      return;
    }

    if (promise.current) {
      await promise.current;
    }

    if (!isEqual(formState.values, initialValues)) {
      promise.current = onSave(formState.values);
    }
  }

  return (
    <FormSpy
      subscription={{ values: true, active: true }}
      onChange={onChange}
    />
  );
}
