import React from 'react';
import { Field, FieldProps as FieldValidationProps } from '@42.nl/final-form-field-validation';
import getDisplayName from 'react-display-name';
import { merge, omit, pick } from 'lodash';

import { getState, illegalPropsDetected } from '../utils';
import { Tooltip } from '../../core/Tooltip/Tooltip';
import { useHasErrors } from '../../hooks/useHasErrors/useHasErrors';
import { FieldCompatible } from '../types';
import { FieldValidator } from 'final-form';
import { FieldRenderProps } from 'react-final-form';
import { ErrorMode, FieldError } from '../FormError/FieldError';

// This is a list of props that `withField` will pass to the `final-form`
// Field, but not the wrapper.
const passedFieldProps = [ 'initialValue', 'format', 'formatOnBlur', 'parse' ];

// These are the props that are managed by `withField` and should not
// be set manually by the user.
const managedProps = [
  'onChange',
  'onBlur',
  'onFocus',
  'value',
  'color',
  'valid',
  'error'
];

export type FieldProps<Value, ChangeValue> = FieldCompatible<Value,
  ChangeValue> & {
  errorMode?: ErrorMode;
};

export type WithFieldProps<Value, P> = FieldValidationProps<Value, any> &
  Omit<P,
    | 'onFocus'
    | 'onBlur'
    | 'onChange'
    | 'value'
    | 'color'
    | 'valid'
    | 'error'>;

/**
 * withField is a Higher Order Component which takes an input element
 * which is `FieldCompatible` as defined by the interface, and turns
 * it into a Component which uses `Field` so it can be used in
 * a final-form form.
 *
 * Basically all props needed in `FieldCompatible` are plugged into the
 * Wrapper, by taking the `input` and `meta` from `final-form` and assigning
 * them into the correct slots.
 *
 * It also automatically adds the `FormError` component as the error
 * slot so errors are rendered.
 *
 * @param Wrapper The Component which is `FieldCompatible`.
 * @param defaultValidators Optional validators the field should use by default
 */
export function withField<Value,
  ChangeValue,
  P extends FieldProps<Value, ChangeValue>>(Wrapper: React.ComponentType<P>, defaultValidators?: (props: WithFieldProps<Value, P>) => FieldValidator<Value>[]) {
  const displayName = `Field${getDisplayName(Wrapper)}`;

  WithField.displayName = displayName;

  function WithField(props: WithFieldProps<Value, P>) {
    const illegalProps = managedProps.filter((p) => props[p] !== undefined);

    if (illegalProps.length > 0) {
      illegalPropsDetected('withField', displayName, illegalProps, managedProps);
    }

    const [ hasErrors, setHasErrors ] = useHasErrors();

    const {
      errorMode = 'below',
      name,
      validators,
      asyncValidators,
      asyncValidatorsDebounce,
      allowNull,
      ...rest
    } = props;

    // A bit magical this one but this makes TypeScript accept all other
    // props as the Props to the wrapped component.
    const wrapperProps = (omit(rest, passedFieldProps) as unknown) as P;

    const fieldProps = pick(rest, [
      'initialValue',
      'format',
      'formatOnBlur',
      'parse'
    ]);

    const error = (
      <FieldError
        name={name}
        setHasErrors={setHasErrors}
        errorMode={errorMode}
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
      <Field<Value, any>
        name={name}
        validators={defaultValidators ? merge(defaultValidators(props), validators) : validators}
        asyncValidators={asyncValidators}
        asyncValidatorsDebounce={asyncValidatorsDebounce}
        subscription={fieldSubscription}
        render={(field) => {
          return hasErrors && errorMode === 'tooltip' ? (
            <Tooltip
              content={error}
              tag="div"
              className="w-100"
              placement="bottom"
            >
              <Wrapper
                {...wrapperProps}
                {...mapFieldRenderProps(field, hasErrors)}
              />
            </Tooltip>
          ) : (
            <Wrapper
              {...wrapperProps}
              {...mapFieldRenderProps(field, hasErrors)}
              error={error}
            />
          );
        }}
        {...fieldProps}
      />
    );
  }

  return WithField;
}

function mapFieldRenderProps<T>(
  props: FieldRenderProps<T, any>,
  hasErrors: boolean
) {
  const { input, meta } = props;

  const state = getState({ hasErrors: hasErrors, touched: meta.touched });

  return {
    ...state,
    onChange: input.onChange,
    name: input.name,
    onFocus: input.onFocus,
    onBlur: input.onBlur,
    value: input.value
  };
}
