import React from 'react';
import { FieldRenderProps, Field } from 'react-final-form';
import { JarbField, JarbFieldProps } from '@42.nl/jarb-final-form';
import getDisplayName from 'react-display-name';
import { clearErrorsForValidator } from '@42.nl/react-error-store';

import FormError from '../FormError/FormError';
import { getState } from '../utils';

interface FieldCompatible<Value, ChangeValue> {
  onChange: (value: ChangeValue) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  value?: Value;
  color?: string;
  valid?: boolean;
  error?: React.ReactNode;
}

/**
 * withJarb is a Higher Order Component which takes an input element
 * which is `FieldCompatible` as defined by the interface, and turns
 * it into a Component which uses `JarbField` so it can be used in
 * a final-form form.
 *
 * Basically all props needed in `FieldCompatible` are plugged into the
 * Wrapper, by taking the `input` and `meta` from `final-form` and assigning
 * them into the correct slots.
 *
 * Also automatically adds the `FormError` component as the error
 * slot so errors are rendered.
 *
 * @param Wrapper The Component which is `FieldCompatible`.
 */
export default function withJarb<
  Value,
  ChangeValue,
  P extends FieldCompatible<Value, ChangeValue>
>(Wrapper: React.ComponentType<P>) {
  WithJarb.displayName = `Jarb${getDisplayName(Wrapper)}`;

  function WithJarb(
    props: JarbFieldProps<Value, any> &
      Omit<
        P,
        | 'onFocus'
        | 'onBlur'
        | 'onChange'
        | 'value'
        | 'color'
        | 'valid'
        | 'error'
      >
  ) {
    const { name, jarb, validators, ...rest } = props;

    // Bit magical this one but this makes TypeScript accept all other
    // props as the Props to the wrapped component.
    const wrapperProps = (rest as unknown) as P;

    // Listen to all props on the `Meta` object.
    const errorSubscription = {
      active: true,
      touched: true,
      error: true
    };

    const error = (
      <Field
        name={name}
        subscription={errorSubscription}
        render={field => (
          <FormError meta={field.meta} validator={jarb.validator} />
        )}
      />
    );

    const fieldSubscription = {
      value: true, // Because value needs to be displayed.
      // Reset is due to `getState` needing them
      invalid: true,
      touched: true,
      validating: true
    };

    return (
      <JarbField<Value, any>
        name={name}
        jarb={jarb}
        validators={validators}
        subscription={fieldSubscription}
        render={field => (
          <Wrapper
            {...wrapperProps}
            {...mapFieldRenderProps(error, field, jarb.validator)}
          />
        )}
      />
    );
  }

  return WithJarb;
}

function mapFieldRenderProps<T>(
  error: React.ReactNode,
  props: FieldRenderProps<T, any>,
  validator: string
) {
  const { input, meta } = props;

  const state = getState(meta);

  return {
    ...state,
    onChange: (value: T) => {
      input.onChange(value);

      // Remove any back-end errors now that the value has changed
      clearErrorsForValidator(validator);
    },
    onFocus: input.onFocus,
    onBlur: input.onBlur,
    value: input.value,
    error
  };
}
