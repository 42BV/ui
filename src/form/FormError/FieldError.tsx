import { Field } from 'react-final-form';
import { FormError } from './FormError';
import React, { Dispatch, SetStateAction } from 'react';
import { FieldSubscription } from 'final-form';

export type ErrorMode = 'tooltip' | 'below';

type Props = {
  name: string;
  validator?: string;
  setHasErrors: Dispatch<SetStateAction<boolean>>;
  errorMode: ErrorMode;
};

export function FieldError({
  name,
  validator,
  setHasErrors,
  errorMode
}: Props) {
  // Listen to all props on the `Meta` object.
  const errorSubscription: FieldSubscription = {
    active: true,
    touched: true,
    error: true,
    submitError: true,
    dirtySinceLastSubmit: true,
    value: true,
    validating: true
  };

  return (
    <Field
      name={name}
      subscription={errorSubscription}
      render={(field) => (
        <FormError
          value={field.input.value}
          meta={field.meta}
          validator={validator}
          onChange={setHasErrors}
          className={`error-${errorMode}`}
        />
      )}
    />
  );
}
